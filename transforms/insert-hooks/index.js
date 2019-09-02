const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();
  const root = j(file.source);

  const helperNames = [
    'setupTranslations',
    'setupMirage'
  ];

  const setupTestTypes = [
    'setupTest',
    'setupRenderingTest',
    'setupApplicationTest',
    'setupMirageRenderingTest',
  ];

  helperNames.forEach((name) => {
    insertHooks(name);
  });

  return root.toSource({
    commaDangle: false
  });

  function insertHooks(name) {
    let shouldSetHooks = false;
    root.find(j.CallExpression, { callee: { name }})
      .forEach(({ node }) => {
        let hooksVar = j.identifier('hooks');
        node.arguments = [hooksVar];
        shouldSetHooks = true;
      });

    if (shouldSetHooks) {
      setupTestTypes.forEach(name => {
        insertVariableHooks(name);
      });
    }
  }

  function insertVariableHooks(name) {
    root.find(j.Identifier, { name })
      .filter((path) => path.name === 'callee')
      .forEach((path) => {
        if (path.parent.name !== 'init') {
          path.value.name = `let hooks = ${path.value.name}`;
        }
      });
  }
}
