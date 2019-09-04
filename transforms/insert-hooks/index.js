const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');
const beautifyImports = require('../beautify-imports');

module.exports = function transformer(file, api) {
  let source = file.source;
  const j = getParser(api);
  const options = getOptions();
  const root = j(file.source);
  const lineTerminator = source.indexOf('\r\n') > -1 ? '\r\n' : '\n';

  const helperNames = [
    'setupTranslations',
    'setupMirage',
    'setupSinonSandbox',
    'setupOverlay'
  ];

  const hookCallbacks = ['beforeEach', 'afterEach'];

  const setupTestTypes = [
    'setupTest',
    'setupRenderingTest',
    'setupApplicationTest'
  ];

  const removeTypes = [
    'setupRenderingWithMirage',
    'setupAcceptance'
  ];

  const allTestTypes = [...setupTestTypes, ...removeTypes];

  hookCallbacks.forEach((name) => {
    addCallbackHooks(root, name)
  });

  removeTypes.forEach((name) => {
    let importSpecifier = findImportSpecifier(root, name);

    // Hooks added only for the helpers
    helperNames.forEach((name) => {
      if (importSpecifier.length > 0) {
        removeHelper(root, name);
      } else {
        insertHooks(name);
      }
    });
  });

  removeUnused(root);
  cleanupBlankImports(root);

  source = beautifyImports(
    root.toSource({
      quote: 'single',
      lineTerminator,
      trailingComma: false
    })
  );

  return source;

  function addCallbackHooks(root, name) {
    let shouldSetHooks = false;
    root.find(j.CallExpression, {
       callee: {
         name
       }
     })
    .filter((path) => {
      return (path.parent.parent.parent.parent.value.callee.name !== 'context');
    })
    .forEach(({node}) => {
      let identifier = node.callee;
      identifier.name = `hooks.${identifier.name}`;
      shouldSetHooks = true;
    });

    if (shouldSetHooks) {
      allTestTypes.forEach(name => {
        insertVariableHooks(name);
      });
    }
  }

  function removeHelper(root, name) {
    findImportSpecifier(root, name).remove();
    findExpression(root, name).remove();
  }

  function findImportSpecifier(root, declarationName) {
    return root.find(j.ImportSpecifier, {
      imported: {
        name: declarationName
      }
    });
  };

  function findExpression(root, identifierName) {
    return root.find(j.ExpressionStatement, {
      expression: {
        callee: {
          name: identifierName
        }
      }
    });
  }

  function cleanupBlankImports(root) {
    root.find(j.ImportDeclaration)
      .filter((path) => (path.get().value.specifiers.length === 0))
      .remove();
  }

  function insertHooks(name) {
    let shouldSetHooks = false;
    root.find(j.CallExpression, {
        callee: {
          name
        }
      })
      .forEach(({
        node
      }) => {
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
    root.find(j.Identifier, {
        name
      })
      .filter((path) => path.name === 'callee')
      .forEach((path) => {
        if (path.parent.name !== 'init') {
          path.value.name = `let hooks = ${path.value.name}`;
        }
      });
  }

  function removeUnused(root) {
    root.find(j.ImportSpecifier)
      .filter((path) => {
        let { node } = path;
        let name = node.imported.name;
        let calledImport = root
          .find(j.CallExpression, { callee: { name }})
          .filter((path) => {
            return path.name !== 'imported'
          });
        return (hookCallbacks.includes(name) && calledImport.length === 0)
      }).remove();
  }
}
