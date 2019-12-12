// Playground
// https://astexplorer.net/#/gist/7d31179fdf8c0ca4c34c2e1a453c5c18/73608ccb69d86c3ca5f131a60648bb629e58ed7f

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
  const storeFunctions = ['createRecord', 'findRecord', 'findAll', 'pushPayload', 'query', 'queryRecord'];
  
  storeFunctions.forEach((storeFunctionName) => {
    firstRoot.find(j.CallExpression, {
      callee: {
        property: {
          name: storeFunctionName
        }
      }
    })
    .closest(j.ExpressionStatement)
    .filter(path => {
      if (isRunLoop(path)) {
        return false;
      }
      return isStoreExpressionInsideRunOrDescribe(path);
    })
    .replaceWith(wrapRunLoop);

    firstRoot.find(j.CallExpression, {
      callee: {
        property: {
          name: storeFunctionName
        }
      }
    })
    .closest(j.VariableDeclaration)
    .filter(isStoreExpressionInsideRunOrDescribe)
    .replaceWith(wrapRunLoop);
    
  });

  // From this phase we will be combining consecutive 
  // sequential run loops while maintaining their order
  let secondRoot = j(firstRoot.toSource());

  let blocksHavingRunLoopExpressions = secondRoot.find(j.CallExpression, {
    callee: {
      name: "run"
    }
  }).closest(j.BlockStatement)

  blocksHavingRunLoopExpressions.forEach((nodePath) => {
    let { node } = nodePath;
    // Below array stores information about where an expression 
    // is a run loop expression or not, for all expressions inside a block
    let exArr = []

    node.body.forEach((statement) => {
      if (statement.expression &&
        statement.expression.callee &&
        statement.expression.callee.name === 'run'
        ) {
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
        // Use async in run loop, when await expressions are found while combining run loops
        if (hasAwaitExpression(cNodes[0])) {
          let runLoopArrowExpression = j(cNodes[0]).find(j.ArrowFunctionExpression);
          if (runLoopArrowExpression.length > 0) {
            runLoopArrowExpression.get().node.async = true;
          }
        }

        batcher.forEach((key, index) => {
          if (index !== 0) {
            delete node.body[key];
          }
        })
      }
      batcher = [];
    }

    return node;
  });

  // After this phase we will be bring the variable declarations 
  // present inside the run loop to the outer block scope
  let thirdRoot = j(secondRoot.toSource()); 

  thirdRoot.find(j.CallExpression, {
    callee: {
      name: "run"
    }
  })
  .find(j.VariableDeclaration)
  .forEach((nodePath) => {
    let { node } = nodePath;
    let declarationType = nodePath.node.kind;
    let declaration = j(nodePath).find(j.VariableDeclarator).get().node;
    let newDeclaration = j.variableDeclaration(declarationType, [j.variableDeclarator(j.identifier(declaration.id.name), null)]);
    let variableName = declaration.id.name;

    j(nodePath).closest(j.ExpressionStatement).get().insertBefore(newDeclaration);
    j(nodePath).replaceWith(j.expressionStatement(
      j.assignmentExpression("=", j.identifier(variableName), declaration.init)
    ));
  });

  // Add run loop import declaration if required
  if (isModified && !isImportExists) {
    const importStatement = j.importDeclaration(
      [j.importSpecifier(j.identifier("run"), j.identifier("run"))],
      j.literal("@ember/runloop")
    );
    thirdRoot.find(j.ImportDeclaration)
      .get()
      .insertAfter(importStatement);
  }

  function isRunLoop(path){
    return (path.value.expression &&
      path.value.expression.callee &&
      path.value.expression.callee.name == 'run');
  }

  function wrapRunLoop(nodePath) {
    const { node } = nodePath;
    // wrap with run
    const arrow = j.arrowFunctionExpression([], j.blockStatement([node]));
    if (hasAwaitExpression(nodePath)) {
      arrow.async = true;
    }
    const newNode = j.expressionStatement(
      j.callExpression(j.identifier("run"), [
        arrow
      ])
    );
    isModified = true;
    return newNode;
  }

  function isStoreExpressionInsideRunOrDescribe(path){
    return (
      path.parent &&
      path.parent.parent &&
      path.parent.parent.parent.node.callee
      && !["run", "describe"].includes(path.parent.parent.parent.node.callee.name))
  }

  function hasAwaitExpression(path) {
    return (j(path).find(j.AwaitExpression).length > 0);
  }

  return beautifyImports(
    thirdRoot.toSource({
      quote: 'single',
      lineTerminator,
      trailingComma: false
    })
  );
};
