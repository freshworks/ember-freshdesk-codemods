function removeUnusedImportSpecifiers(j, root) {
  root.find(j.ImportSpecifier)
    .filter((path) => {
      let importName = path.node.imported.name;
      let identifierPresent = root.find(j.Identifier, {
          name: importName
        })
        .filter((path) => (path.name === 'callee'))

      return (identifierPresent.length === 0);
    }).remove();
}

function cleanupBlankImports(j, root) {
  root.find(j.ImportDeclaration)
    .filter((path) => (path.get().value.specifiers.length === 0))
    .remove();
}

function removeDuplicateImports(j, root) {
  let existingList = [];
  root.find(j.ImportSpecifier)
    .filter((path) => {
      let name = path.node.imported.name;
      if(!existingList.includes(name)) {
        existingList.push(path.node.imported.name);
        return false;
      } else {
        // Captured as duplicate import
        return true;
      }
    }).remove();
}

function setupHooksForTest(setupTestTypes, j, root) {
  setupTestTypes.forEach(function(name) {
    root.find(j.FunctionExpression)
      .filter((path) => j(path).find(j.Identifier, { name }).length !== 0)
      .forEach((path) => transformHooks(path, name, j, root));
  });
}

function setupCallbackHooks(hooks, name, j, root) {
  root.find(j.CallExpression, { callee: { name }})
    .filter((path) => {
      let actualPath = path.node.arguments[1];
      let isNestedModule = findIdentifier(actualPath, 'module', j, root).length === 0;
      let hasHooks = hooks.some((name) => {
        return !(findIdentifier(path, name, j, root).length === 0);
      });
      return (isNestedModule && hasHooks);
    })
    .forEach((path) => {
      j(path).find(j.ExpressionStatement)
        .filter((path) => {
          return hooks.some((name) => {
            return !(findIdentifier(path, name, j, root).length === 0);
          });
        })
        .forEach(({node}) => {
          let callee = node.expression.callee;
          let name = callee.name;

          callee.name = `hooks.${name}`;
        });

        return path.node.arguments[1].params = ['hooks'];
    });
}

function findIdentifier(path, name, j, root) {
  return j(path).find(j.Identifier, { name });
}

function transformHooks(path, name, j, root) {
  path.node.params = ['hooks'];

  let hasHooks = j(path).find(j.VariableDeclaration)
    .filter((path) => j(path).find(j.Identifier, { name }).length !== 0);

  if(hasHooks.length === 0) {
    j(path).find(j.Identifier, { name })
      .closest(j.Expression)
      .replaceWith((path) => `${name}(hooks)`);
  } else {
    hasHooks.replaceWith((path) => `${name}(hooks);`);
  }
}

function cleanupImports(j, root) {
  removeUnusedImportSpecifiers(j, root);
  cleanupBlankImports(j, root);
  removeDuplicateImports(j, root);
}

module.exports = {
  cleanupImports,
  cleanupBlankImports,
  removeUnusedImportSpecifiers,
  removeDuplicateImports,
  setupHooksForTest,
  setupCallbackHooks
}
