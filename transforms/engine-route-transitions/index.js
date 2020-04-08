const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const options = getOptions();


  return j(file.source)
    .find(j.CallExpression, {
      callee: {
        property:{ name:  'transitionTo'}
      }
    })
    .forEach(path => {
      let oldName = path.value.arguments[0].value;
      let newName = oldName.replace(/helpdesk\.\w+\./,'');
      path.value.arguments[0].value = newName;
    })
    .toSource({quote: 'single'});

}