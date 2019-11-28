// Playground
// https://astexplorer.net/#/gist/b30b9a6dc8d67bf77d563518de19a32b/f9527ba69f224d390583e8571a5acc5affc6a0ea

const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');
const matcherTransformer = require('./matcher-transformer');
const {
  cleanupImports,
  setupHooksForTest,
  setupCallbackHooks
} = require('../cleanup-imports');
const beautifyImports = require('../beautify-imports');
const {
  findExpect,
  renameIdentifiers,
  renameImports
} = require('./utils');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();
  const root = j(file.source);
  const lineTerminator = file.source.indexOf('\r\n') > -1 ? '\r\n' : '\n';

  const renameIdentifierList = [
    ['describe', 'module'],
    ['context', 'module'],
    ['it', 'test'],
    ['setupRenderingWithMirage', 'setupRenderingForModule'],
    ['setupAcceptance', 'setupApplicationForModule']
  ];

  const renameImportImports = [
    ['mocha', 'qunit'],
    ['ember-mocha', 'ember-qunit']
  ]

  const setupTestTypes = [
    'setupTest',
    'setupRenderingTest',
    'setupApplicationTest',
    'setupRenderingForModule',
    'setupApplicationForModule'
  ];

  const callbackHooks = ['before', 'after', 'beforeEach', 'afterEach'];

  renameIdentifiers(renameIdentifierList, root, j);
  renameImports(renameImportImports, root, j);
  // transformer for moving it.skip, describe.skip, module.skip => skip and nested children to have skip
  transformSkippedTests(j, root);

  root.find(j.FunctionExpression)
    .filter((path) => path.parent.node.callee && ['test', 'skip'].includes(path.parent.node.callee.name))
    .forEach(transformerTests);

  cleanupImports(j, root);
  setupHooksForTest(setupTestTypes, j, root);
  setupCallbackHooks(callbackHooks, 'module', j, root);

  return beautifyImports(
    root.toSource({
      quote: 'single',
      lineTerminator,
      trailingComma: false
    })
  );

  function transformSkippedTests(j, root, skipName = 'skip') {
    let collection = root.find(j.CallExpression, {
      callee: {
        property: {
          name: skipName
        }
      }
    }).forEach((path) => {
      let { node } = path;
      let name = (node.callee.object || node.callee).name;

      tranformObjectToCallee(j, path, name);
    }).forEach((path) => {
      j(path.parent).find(j.CallExpression)
        .filter(({node}) => {
          let name = (node.callee.object || node.callee).name;
          return (name === 'test');
        })
        .forEach((path) => {
          tranformObjectToCallee(j, path, skipName);
        });
    });

    if(collection.length > 0) {
      importSkip(root, j, skipName);
    }
  }

  function importSkip(root, j, name) {
    root.find(j.ImportDeclaration, {
      source: {
        value: 'qunit'
      }
    }).forEach((path) => {
      let hasImport = (j(path).find(j.ImportSpecifier, {
        imported: {
          name
        }
      }).length > 0);

      if(!hasImport) {
        path.node.specifiers.push(j.importSpecifier(j.identifier(name)));
      }
    });
  }

  function tranformObjectToCallee(j, path, toName) {
    let node = path.node;
    let callee = node.callee.object || node.callee;

    path.node.callee = j.identifier(toName);
  }

  function filterOnlyFunctions(path) {
    let hasArrowFunction = (j(path).find(j.ArrowFunctionExpression).length === 0);
    let hasFunction = (j(path).find(j.FunctionExpression).length === 0);
    return (hasArrowFunction && hasFunction);
  }

  function pathHasExpects(path) {
    return (findExpect(path, j).length > 0);
  }

  function removeDoneMethod(path) {
    j(path).find(j.Identifier, { name: 'done' })
      .closest(j.AwaitExpression)
      .remove();
    j(path).find(j.Identifier, { name: 'done' })
      .closest(j.CallExpression)
      .remove();
  }

  function transformerTests(path) {
    if(pathHasExpects(path)) {
      path.node.params = ['assert'];
      removeDoneMethod(path);
    }

    filterExpressions(j(path).find(j.ExpressionStatement))
      .forEach(transformExpect);

    filterExpressions(j(path).find(j.ReturnStatement))
      .forEach(returnExtraction);
  }

  function filterExpressions(graphTree) {
    return graphTree
      .filter(pathHasExpects)
      .filter(filterOnlyFunctions)
  }

  function returnExtraction(path) {
    var node = path.node.argument;
    var expression = runMacherTranformer(path.node.argument, path);
    var newNode = j(expression).find(j.ExpressionStatement).get();
    path.node.argument = newNode.value.expression;
  }

  function memberAndCallExtraction(path) {
    var expression = runMacherTranformer(path.node.expression, path);
    var newNode = j(expression).find(j.ExpressionStatement).get();
    path.node.expression = newNode.value.expression;
  }

  function awaitExtraction(path) {
    var expression = runMacherTranformer(path.node.expression.argument, path);
    var newNode = j(expression).find(j.ExpressionStatement).get();
    path.node.expression.argument = newNode.value.expression;
  }

  function transformExpect(path) {
    switch (path.node.expression.type) {
      case 'CallExpression':
      case 'MemberExpression':
        memberAndCallExtraction(path);
      return;
      case 'AwaitExpression':
        awaitExtraction(path);
      return;
    }
  }

  function specialException(expression) {
    return (expression.callee && expression.callee.name === 'expect')
  }

  function runMacherTranformer(expression, path) {
    var matchedExpression = j(expression).toSource();
    var BreakException = {};

    try {
      matcherTransformer
        .forEach(({ name, matcher, transformer }) => {
          if (specialException(expression)) {
            console.log(`
              You may have test with bad assertions!!!
              Check if you are having an expect without an assertion
            `);
            throw BreakException;
          } else if (matcher(expression, path, j, root)) {
            matchedExpression = transformer(expression, path, j, root, BreakException);
            throw BreakException;
          }
        });
    } catch (e) {
      if (e !== BreakException) {
        throw e;
      }
    }

    return matchedExpression;
  }
}
