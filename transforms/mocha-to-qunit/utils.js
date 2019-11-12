function hasValue(value) {
  return !(typeof (value) === 'undefined' || value === null || value === '');
}

function joinParams(...params) {
  return params.filter((param) => hasValue(param)).join(', ');
}

function findExpect(path, j) {
  return j(path).find(j.CallExpression, {
    callee: {
      name: 'expect'
    }
  }).at(0).get();
}

function findNegation(path, j) {
  let notIdentifier = j(path).find(j.Identifier, {
    name: 'not'
  });
  return notIdentifier.length !== 0;
}

function extractExpect(path, j) {
  let expectPath = findExpect(path, j);
  let hasShouldNot = findNegation(path, j);
  let assertArguments = expectPath.node.arguments;
  let assertArgument = assertArguments[0];
  let assertArgumentSource = j(assertArgument).toSource();
  let hasMessage = (assertArguments.length > 1);
  let assertMessage = '';

  if (hasMessage) {
    assertMessage = j(assertArguments[1]).toSource();
  }

  return {
    expectPath,
    assertArgument,
    assertArgumentSource,
    hasMessage,
    assertMessage,
    hasShouldNot
  };
}

module.exports = {
  hasValue,
  joinParams,
  findExpect,
  extractExpect,
  findNegation
}
