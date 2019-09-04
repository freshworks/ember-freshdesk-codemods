const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');
const beautifyImports = require('../beautify-imports');
const mapper = require('./mapper');

module.exports = function transformer(file, api) {
  let source = file.source;
  const j = getParser(api);
  const options = getOptions();
  const root = j(file.source);
  const newImportPath = '@freshdesk/test-helpers';
  const lineTerminator = source.indexOf('\r\n') > -1 ? '\r\n' : '\n';

  mapper.forEach((map) =>
    map.importSpecifiers.sort().forEach(
      (importSpecifiers) => transformImport(
        root,
        importSpecifiers,
        map.importDeclaration
      )
    )
  );

  cleanupBlankImports(root);

  source = beautifyImports(
    root.toSource({
      quote: 'single',
      lineTerminator,
      trailingComma: false
    })
  );

  return source;

  // Check if there any importSpecifier with the given name
  function findImportSpecifier(root, importName, oldImportPath) {
    return root.find(j.ImportSpecifier, {
      imported: {
        name: importName
      }
    }).filter((path) => path.parent.value.source.value === oldImportPath);
  };

  function findImportDeclaration(root, declarationName) {
    return root.find(j.ImportDeclaration, {
      source: {
        value: declarationName
      }
    });
  };

  function createOrImportDeclaration(root, declarationName) {
    let existingDeclaration = findImportDeclaration(root, declarationName);

    if (existingDeclaration.length !== 0) {
      return existingDeclaration.get().value;
    } else {
      let allImports = root.find(j.ImportDeclaration);
      let lastImport = allImports.at(allImports.length - 1);
      let newImport = j.importDeclaration([], j.literal(declarationName));
      lastImport.insertAfter(newImport);
      return newImport;
    }
  };

  function insertNewSpecifier(importDeclaration, specifierName) {
    let newSpecifier = j.importSpecifier(j.identifier(specifierName));
    importDeclaration.specifiers.push(newSpecifier);
  };

  function transformImport(root, specifierName, existingImportPath) {
    let oldImportMethod = findImportSpecifier(root, specifierName, existingImportPath);

    // Remove the import specifier from the old format if present
    oldImportMethod.remove();

    if (oldImportMethod.length !== 0) {
      let importDeclaration = createOrImportDeclaration(root, newImportPath);
      insertNewSpecifier(importDeclaration, specifierName);
    }
  };

  function cleanupBlankImports(root) {
    root.find(j.ImportDeclaration)
      .filter((path) => (path.get().value.specifiers.length === 0))
      .remove();
  }
}
