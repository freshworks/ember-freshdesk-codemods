const { getParser } = require("codemod-cli").jscodeshift;
const { getOptions } = require("codemod-cli");
const beautifyImports = require("../beautify-imports");

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();
  const firstRoot = j(file.source);
  const lineTerminator = file.source.indexOf('\r\n') > -1 ? '\r\n' : '\n';
  let isModified = false;
  const importRun = firstRoot.find(j.ImportDeclaration, {
    source: {
      value: "@ember/runloop"
    }
  });
  const isImportExists = importRun && importRun.length > 0;

  const isRunLoop = function (path) {
    return (path.value.expression &&
      path.value.expression.callee &&
      path.value.expression.callee.name == 'run');
  };

  const isStoreExpressionInsideRunOrDescribe = function (path) {
    return (
      path.parent &&
      path.parent.parent &&
      path.parent.parent.parent.node.callee 
      && !["run", "describe"].includes(path.parent.parent.parent.node.callee.name))
  }

  const storeExpressionsNotInRunLoop = firstRoot
    .find(j.CallExpression)
    .filter(path => {
      return (
        path.node.arguments.length &&
        path.node.arguments.some(n => n.value == "store")
      );
    })
    .closest(j.ExpressionStatement)
    .filter(path => {
      if (isRunLoop(path) || (j(path).find(j.AwaitExpression).length > 0)) {
        return false;
      }
      return isStoreExpressionInsideRunOrDescribe(path);
    });

  storeExpressionsNotInRunLoop.length && storeExpressionsNotInRunLoop.replaceWith(nodePath => {
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

  const storeDeclarationsNotInRunLoop = firstRoot
    .find(j.CallExpression)
    .filter(path => {
      return (
        path.node.arguments.length &&
        path.node.arguments.some(n => n.value == "store")
      );
    })
    .closest(j.VariableDeclaration)
    .filter((path) => {
      let isAwaitExpression = j(path).find(j.AwaitExpression).length > 0;
      return isStoreExpressionInsideRunOrDescribe(path) && !isAwaitExpression;
    });

  storeDeclarationsNotInRunLoop.length && storeDeclarationsNotInRunLoop.replaceWith(nodePath => {
    const { node } = nodePath;
    const newNode = j.expressionStatement(
      j.callExpression(j.identifier("run"), [
        j.arrowFunctionExpression([], j.blockStatement([node]))
      ])
    );
    return newNode;
  });

  // From this phase we will be combining consecutive 
  // sequential run loops while maintaining their order
  let secondRoot = j(firstRoot.toSource());

  let blocksHavingRunLoopExpressions = secondRoot.find(j.CallExpression, {
    callee: {
      name: "run"
    }
  }).closest(j.BlockStatement);

  blocksHavingRunLoopExpressions.forEach((nodePath) => {
    let { node } = nodePath;
    // Below array stores information about where an expression 
    // is a run loop expression or not, for all expressions inside a block
    let exArr = []

    node.body.forEach((statement) => {
      if (statement.expression &&
        statement.expression.callee &&
        statement.expression.callee.name === 'run') {
        exArr.push(true);
      } else {
        exArr.push(false);
      }
    });

    let batcher = [];
    exArr.forEach(function (bool, index) {
      if (bool) {
        batcher.push(index);
      } else {
        transform();
      }
    });
    transform();
    function transform() {
      if (batcher.length > 1) {
        let cNodes = batcher.map((key, index) => {
          return node.body[key];
        })

        let mainBlock = cNodes[0].expression.arguments[0].body;

        let newNodes = [...mainBlock.body];
        cNodes.forEach((currentNode, index) => {
          if (index !== 0) {
            newNodes.push(...currentNode.expression.arguments[0].body.body);
          }
        });

        mainBlock.body = newNodes;

        batcher.forEach((key, index) => {
          if (index !== 0) {
            delete node.body[key];
          }
        })
        isModified = true;
      }
      batcher = [];
    }

    return node;
  });



  if (isModified && !isImportExists) {
    const importStatement = j.importDeclaration(
      [j.importSpecifier(j.identifier("run"), j.identifier("run"))],
      j.literal("@ember/runloop")
    );
    secondRoot
      .find(j.ImportDeclaration)
      .get()
      .insertAfter(importStatement);
  }

  return beautifyImports(
    secondRoot.toSource({
      quote: 'single',
      lineTerminator,
      trailingComma: false
    })
  );
};
