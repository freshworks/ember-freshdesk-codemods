function removeUnusedImportSpecifiers(j, root) {
  root.find(j.ImportSpecifier)
    .filter(path => {
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

function cleanupImports(j, root) {
  removeUnusedImportSpecifiers(j, root);

  cleanupBlankImports(j, root);
}

module.exports = {
  cleanupImports,
  cleanupBlankImports,
  removeUnusedImportSpecifiers
}
