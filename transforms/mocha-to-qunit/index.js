// Playground
// https://astexplorer.net/#/gist/b30b9a6dc8d67bf77d563518de19a32b/f9527ba69f224d390583e8571a5acc5affc6a0ea

const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');
const matcherTransformer = require('./matcher-transformer');
const { cleanupImports } = require('../cleanup-imports');
const beautifyImports = require('../beautify-imports');
const {
  findExpect,
  renameIdentifiers,
  renameImports
} = require('./utils');

// TODO We need to address the following
// [ ] Take the list of expects and convert them to qunit asserts
// [ ] Use hooks from module params and not as return value for setupTests
// [ ] Add more fixtures
// [ ] Take a sample batch of 50 and migrate them to qunit using some simple code-mods.
// [X] Refactor to a mapper to determine what type of assertion and what type of transform.
// [X] Clean up unused imports sych as context, findAll.
// [ ] Clean up any beforeEach and afterEach called directly form mocha.

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();
  const root = j(file.source);
  const lineTerminator = file.source.indexOf('\r\n') > -1 ? '\r\n' : '\n';

  const renameIdentifierList = [
    ['describe', 'module'],
    ['it', 'test'],
    ['setupRenderingWithMirage', 'setupRenderingForModule'],
    ['setupAcceptance', 'setupAcceptanceForModule']
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

  renameIdentifiers(renameIdentifierList, root, j);
  renameImports(renameImportImports, root, j);

  root.find(j.FunctionExpression)
    .filter((path) => (path.parent.node.callee.name == 'test'))
    .forEach(transformerTests);

  cleanupImports(j, root);

  setupTestTypes.forEach(function(setupTestType) {
    root.find(j.FunctionExpression)
      .filter((path) => j(path).find(j.Identifier, { name: setupTestType }).length !== 0)
      .forEach((path) => {
        if (path.node.params.length === 0) {
          path.node.params.push('hooks');
        }

        j(path).find(j.VariableDeclaration)
          .filter((path) => j(path).find(j.Identifier, { name: setupTestType }).length !== 0)
          .replaceWith((path) => `${setupTestType}(hooks);`);
      });
  });

  return beautifyImports(
    root.toSource({
      quote: 'single',
      lineTerminator,
      trailingComma: false
    })
  );

  function filterOnlyExpectExpressions(path) {
    let hasExpect = (findExpect(path, j).length > 0);
    let hasArrowFunction = (j(path).find(j.ArrowFunctionExpression).length === 0);
    let hasFunction = (j(path).find(j.FunctionExpression).length === 0);
    return (hasArrowFunction && hasFunction && hasExpect);
  }

  function transformerTests(path) {
    if (path.node.params.length === 0) {
      path.node.params.push('assert');
    }

    j(path).find(j.ExpressionStatement)
      .filter(filterOnlyExpectExpressions)
      .forEach(transformExpect);
  }

  function transformExpect(path) {
    let expression = runMacherTranformer(path);
    let newNode = j(expression).find(j.ExpressionStatement).get();
    path.node.expression = newNode.value.expression;
  }

  function runMacherTranformer(path) {
    var matchedExpression = j(path.node.expression).toSource();
    var BreakException = {};

    try {
      matcherTransformer
        .forEach(({ name, matcher, transformer }) => {
          if (matcher(path.node.expression, path, j, root)) {
            matchedExpression = transformer(path.node.expression, path, j, root);
            throw BreakException;
          }
        });
    } catch (e) {
      if (e !== BreakException) throw e;
    }

    return matchedExpression;
  }

}
