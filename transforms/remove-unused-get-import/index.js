const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const root = j(file.source);
  
  const importGet = root.find(j.ImportSpecifier, {
    local: {
      name: "get"
    }
  });
  
  const isOnlyImport = importGet.length && importGet.at(0).get().parent.value.specifiers.length === 1;
  
  if(importGet.length) {
    const getExp = root.find(j.CallExpression, {
      callee: {
        name: "get"
      }
    });
    const getThisExp = root.find(j.CallExpression, {
      callee: {
        object: {
          type: "ThisExpression"
        },
        property: {
          name: "get"
        }
      }
    });
    if(getExp.length === 0 && getThisExp.length === 0) {
      isOnlyImport ? importGet.closest(j.ImportDeclaration).remove() : importGet.remove();
    }
  }

  return root.toSource();
}