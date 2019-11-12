const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();
  const root = j(file.source);
  const testHelpers = ['setupCurrentAccount', 'setupCurrentUser'];
  const removeThisFromHelpers = ['stubRouter'];

  testHelpers.forEach((name) => {
    convertToAsync(root, name);
  });

  removeThisFromHelpers.forEach((name) => {
    convertToAsync(root, name, false);
  });

  return root.toSource({
    quote: 'single'
  });

  function convertToAsync(root, name, addAwait = true) {
    root.find(j.CallExpression, {
      callee: {
        name
      }
    }).forEach((path) => {
      let { node } = path;

      // Remove the first param if its a "ThisExpression"
      if (node.arguments[0] && node.arguments[0].type === 'ThisExpression') {
        node.arguments.shift();
      }

      // Add await if the parent is not an await statement
      if (addAwait && path.parent.value.type === 'ExpressionStatement') {
        path.scope.node.async = true;
        node.callee.name = `await ${node.callee.name}`;
      }
    });
  }
}
