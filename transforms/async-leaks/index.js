const { getParser } = require("codemod-cli").jscodeshift;
const { getOptions } = require("codemod-cli");
const beautifyImports = require("../beautify-imports");

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();
  const root = j(file.source);
  const lineTerminator = file.source.indexOf('\r\n') > -1 ? '\r\n' : '\n';
  let isModified = false;
  let groupedNodes;
  const importRun = root.find(j.ImportDeclaration, {
    source: {
      value: "@ember/runloop"
    }
  });
  const isImportExists = importRun && importRun.length > 0;

  const blocks = root.find(j.BlockStatement).filter((path) => {
    return ['it', 'after', 'before', 'afterEach', 'beforeEach']
      .includes(path.parent.parent.value.callee.name || path.parent.parent.value.callee.property.name)
  });

  blocks.forEach((block) => {
    groupedNodes = [];
    const leakingExpression = j(block)
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
        const currentNode = nodePath.value;
        const prevNode = exp[index - 1] ? exp[index - 1].value : null;
        const nextNode = exp[index + 1] ? exp[index + 1].value : null;
        return (currentNode.start == (prevNode && prevNode.end + 5) || currentNode.end + 5 == (nextNode && nextNode.start));
      });

    groupedExp.length && groupedExp.forEach(nodePath => {
      const { node } = nodePath;
      groupedNodes.push(node);
      isModified = true;
    });

    const newNodes = j.expressionStatement(
      j.callExpression(j.identifier("run"), [j.arrowFunctionExpression([], j.blockStatement([...groupedNodes]))])
    );
    groupedExp.remove();
    groupedExp && groupedNodes.length && groupedExp.get().insertAfter(newNodes);

    // FILTER SOLO
    const soloExp = leakingExpression
      .filter((nodePath, index, exp) => {
        const currentNode = nodePath.value;
        const prevNode = exp[index - 1] ? exp[index - 1].value : null;
        const nextNode = exp[index + 1] ? exp[index + 1].value : null;
        return (currentNode && !(currentNode.start == (prevNode && prevNode.end + 5) || currentNode.end + 5 == (nextNode && nextNode.start)));
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

  return beautifyImports(
    root.toSource({
      quote: 'single',
      lineTerminator,
      trailingComma: false
    })
  );
};
