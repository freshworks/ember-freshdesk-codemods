const { getParser } = require("codemod-cli").jscodeshift;
const { getOptions } = require("codemod-cli");

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();
  const root = j(file.source);
  let isModified = false;
  const importRun = root.find(j.ImportDeclaration, {
    source: {
      value: "@ember/runloop"
    }
  });
  const isImportExists = importRun && importRun.length > 0;

  const asyncExpression = root
    .find(j.CallExpression)
    .filter(path => {
      return (
        path.node.arguments.length === 1 &&
        path.node.arguments[0].value == "store"
      );
    })
    .closest(j.ExpressionStatement)
    .filter(path => {
      // check for existing run loop
      return (
        path.parent.parent.parent.node.callee &&
        path.parent.parent.parent.node.callee.name != "run"
      );
    });

  asyncExpression.replaceWith(nodePath => {
    const { node } = nodePath;
    // wrap with run
    const newNode = j.expressionStatement(
      j.callExpression(j.identifier("run"), [
        j.arrowFunctionExpression([], j.blockStatement([node]))
      ])
    );
    isModified = true;
    return newNode;
  });

  if (isModified && !isImportExists) {
    const importStatement = j.importDeclaration(
      [j.importSpecifier(j.identifier("run"), j.identifier("run"))],
      j.literal("@ember/runloop")
    );
    root
      .find(j.ImportDeclaration)
      .get()
      .insertAfter(importStatement);
  }

  return root.toSource();
};
