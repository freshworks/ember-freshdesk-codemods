const { getParser } = require("codemod-cli").jscodeshift;
const { getOptions } = require("codemod-cli");

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();
  const root = j(file.source);
  let isModified = false;
  let groupedNodes = [];
  const importRun = root.find(j.ImportDeclaration, {
    source: {
      value: "@ember/runloop"
    }
  });
  const isImportExists = importRun && importRun.length > 0;

  const leakingExpression = root
    .find(j.CallExpression)
    .filter(path => {
      return (
        path.node.arguments.length &&
        path.node.arguments.some(n => n.value == "store")
      );
    })
    .closest(j.ExpressionStatement)
    .filter(path => {
      // check for existing run loop
      return path.parent.parent.parent.node.callee && path.parent.parent.parent.node.callee.name != "run";
    });
  
  // GROUP ADJACENT
  const groupedExp = leakingExpression
  	.filter((nodePath, index, exp) => {
      const { node } = nodePath.parent;
      const prevNode = exp[index-1] ? exp[index-1].parent.node : null;
      const nextNode = exp[index+1] ? exp[index+1].parent.node : null;
      return (node.start == (prevNode && prevNode.start) || node.start == (nextNode && nextNode.start));
    });
    
  groupedExp.length && groupedExp.forEach(nodePath => {
      const { node } = nodePath;
      groupedNodes.push(node);
    });
  
  const newNodes = j.expressionStatement(
    j.callExpression(j.identifier("run"), [j.arrowFunctionExpression([], j.blockStatement([...groupedNodes]))])
  );
  groupedExp.remove();
  groupedExp && groupedNodes.length && groupedExp.get().insertAfter(newNodes);
  
  // FILTER SOLO
  const soloExp = leakingExpression
  	.filter((nodePath, index, exp) => {
      const { node } = nodePath.parent;
      const prevNode = exp[index-1] ? exp[index-1].parent.node : null;
      const nextNode = exp[index+1] ? exp[index+1].parent.node : null;
      return !(node.start == (prevNode && prevNode.start) || node.start == (nextNode && nextNode.start));
    });

  soloExp.length && soloExp.replaceWith(nodePath => {
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
