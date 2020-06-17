const { getParser } = require("codemod-cli").jscodeshift;
const { getOptions } = require("codemod-cli");

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();

  const root = j(file.source);
  const body = root.get().value.program.body;

  const importDecl = j.importDeclaration(
    [j.importDefaultSpecifier(j.identifier("layout"))],
    j.stringLiteral("../../templates/components/page-layout/admin-content")
  );

  body.unshift(importDecl);

  root
    .find(j.ExportDefaultDeclaration, {
      declaration: {
        callee: {
          object: { name: "Component" },
          property: { name: "extend" },
        },
      },
    })
    .forEach((path) => {});

  return root.toSource();
};
