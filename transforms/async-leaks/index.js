const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();

  const root = j(file.source);

  root
    .find(j.CallExpression)
    .filter(path => {
      return path.node.arguments.length === 1 && path.node.arguments[0].value == "store";
    })
    .closest(j.ExpressionStatement)
    .replaceWith(nodePath => {
      const { node } = nodePath;
      // wrap with run
      const newNode = j.expressionStatement(
        j.callExpression(j.identifier("run"), [
          j.arrowFunctionExpression([], j.blockStatement([node]))
        ])
      );
      return newNode;
    });

  return root.toSource();
}