// Playground
// https://astexplorer.net/#/gist/b30b9a6dc8d67bf77d563518de19a32b/f9527ba69f224d390583e8571a5acc5affc6a0ea

const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');
const matcherDefination = require('./matcher-transformer');
const { cleanupImports } = require('../cleanup-imports');
const beautifyImports = require('../beautify-imports');

// TODO We need to address the following
// [ ] Take the list of expects and convert them to qunit asserts
// [ ] Use hooks from module params and not as return value for setupTests
// [ ] Add more fixtures
// [ ] Take a sample batch of 50 and migrate them to qunit using some simple code-mods.
// [ ] Refactor to a mapper to determine what type of assertion and what type of transform.
// [X] Clean up unused imports sych as context, findAll.

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();
  const root = j(file.source);
  const matcherTransformer = matcherDefination;
  const lineTerminator = file.source.indexOf('\r\n') > -1 ? '\r\n' : '\n';

  renameIdentifier('describe', 'module');
  renameIdentifier('it', 'test');
  renameIdentifier('setupRenderingWithMirage', 'setupRenderingForModule');
  renameIdentifier('setupAcceptance', 'setupAcceptanceForModule');
  renameImport('mocha', 'qunit');
  renameImport('ember-mocha', 'ember-qunit');

   root.find(j.FunctionExpression)
  	.filter((path) => {
       return (path.parent.node.callee.name == 'test');
     }).forEach((path) => {
  		if (path.node.params.length === 0) {
          path.node.params.push('assert');
        }

     	j(path).find(j.ExpressionStatement)
         .filter((path) => {
           let collection = j(path).find(j.Identifier, { name: 'expect' });
           return (collection.length > 0);
         })
         .forEach(transformExpect);
  	 });

  function runMacherTranformer(path) {
    var matchedExpression = j(path.node.expression).toSource();
    var BreakException = {};

    try {
      matcherTransformer
        .forEach(({ name, note, matcher, transformer }) => {
          if (matcher(path.node.expression)) {
            matchedExpression = transformer(path, path.node.expression, j, root);
            throw BreakException;
          }
        });
    } catch (e) {
      if (e !== BreakException) throw e;
    }

    return matchedExpression;
  }

  function transformExpect(path) {
    let expression = runMacherTranformer(path);
    let newNode = j(expression).find(j.ExpressionStatement).get();
    path.node.expression = newNode.value.expression;
  }

  cleanupImports(j, root);

  return beautifyImports(
    root.toSource({
      quote: 'single',
      lineTerminator,
      trailingComma: false
    })
  );

  function renameIdentifier(fromName, toName) {
    root.find(j.Identifier, { name: fromName })
      .forEach(path => path.node.name = toName);
  }

  function renameImport(fromName, toName) {
    root.find(j.ImportDeclaration, {
      source: {
        value: fromName
      }
    })
    .forEach(({node}) => node.source.value = toName);
  }
}
