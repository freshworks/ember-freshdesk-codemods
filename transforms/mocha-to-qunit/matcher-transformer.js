const { hasValue, joinParams, extractExpect } = require('./utils');

module.exports = [{
  name: 'expected-true',
  // expect().to.be.true;
  matcher: function(expression, path, j) {
    return (expression.property && expression.property.name === 'true');
  },
  transformer: function(expression, path, j) {
    var {
      assertArgumentSource,
      assertMessage,
      hasShouldNot
    } = extractExpect(path, j);

    var assertMethod = hasShouldNot ? 'notEqual': 'equal';

    return `assert.${assertMethod}(${joinParams(assertArgumentSource, true, assertMessage)});`;
  }
}, {
  name: 'expected-false',
  // expect().to.be.ok;
  matcher: function (expression) {
    return (expression.property && expression.property.name === 'ok');
  },
  transformer: function (expression, path, j) {
    var {
      assertArgumentSource,
      assertMessage,
      hasShouldNot
    } = extractExpect(path, j);

    var assertMethod = hasShouldNot ? 'notOk' : 'ok';

    return `assert.${assertMethod}(${joinParams(assertArgumentSource, assertMessage)});`;
  }
}, {
  name: 'expected-false',
  // expect().to.be.false;
  matcher: function (expression) {
    return (expression.property && expression.property.name === 'false');
  },
  transformer: function (expression, path, j) {
    var {
      assertArgumentSource,
      assertMessage,
      hasShouldNot
    } = extractExpect(path, j);

    var assertMethod = hasShouldNot ? 'notEqual' : 'equal';

    return `assert.${assertMethod}(${joinParams(assertArgumentSource, false, assertMessage)});`;
  }
}, {
  name: 'expected-empty',
  // expect('', 'empty string').to.be.empty;
  // expect([], 'empty array').to.be.empty;
  // expect({}, 'empty object').to.be.empty;
  // expect([1, 2], 'non empty array').to.not.be.empty;
  // expect({"name": "freshworks"}, 'non empty object').to.not.be.empty;
  matcher: function(expression) {
    return (expression.property && expression.property.name === 'empty');
  },
  // assert.notOk('', 'empty string');
  // assert.notOk(Array.from([]).length, 'empty array');
  // assert.notOk(Object.keys({}).length, 'empty object');
  // assert.ok(Array.from([1, 2]).length, 'non empty array');
  // assert.ok(Object.keys({"name": "freshworks"}).length, 'non empty object');
  transformer: function (expression, path, j) {
    let { assertArgument, assertArgumentSource, assertMessage, hasShouldNot } = extractExpect(path, j);
    
    let assertParams = '';
    let assertMethod = hasShouldNot ? 'ok' : 'notOk';
    
    switch(assertArgument.type) {
      case "Literal":
        assertParams = joinParams(assertArgumentSource, assertMessage);
        break;
      case "ArrayExpression":
        let constructArr = `Array.from(${assertArgumentSource}).length`;
        assertParams = joinParams(constructArr, assertMessage);
        break;
      case "ObjectExpression":
        let constructObj = `Object.keys(${assertArgumentSource}).length`;
        assertParams = joinParams(constructObj, assertMessage);
        break;
      default:
        assertParams = joinParams(assertArgument.value, assertMessage);
        break;
    }

    return `assert.${assertMethod}(${assertParams});`;
  }
}, {
  name: 'expected-equal',
  // expect(true).to.equal(true);
  matcher: function(expression) {
    return (expression.callee && expression.callee.property.name === 'equal');
  },
  transformer: function (expression, path, j) {
    var { assertArgumentSource, assertMessage } = extractExpect(path, j);
    var expectedArgument = j(expression.arguments).toSource();

    return `assert.equal(${joinParams(assertArgumentSource, expectedArgument, assertMessage)});`;
  }
}, {
  name: 'expected-length',
  // expect(findAll('[data-test-id=page-title]')).to.have.length(1);
  matcher: function(expression) {
    return (expression.callee && expression.callee.property.name === 'length');
  },
  transformer: function (expression, path, j) {
    var { assertArgument, assertMessage } = extractExpect(path, j);

    var existsParam = null;
    var lengthValue = expression.arguments[0].value;
    var domSelector = j(assertArgument.arguments).toSource();
    var domExpression;

    if (lengthValue === 0) {
      domExpression = `doesNotExist(${assertMessage})`;
    } else {
      if ((lengthValue > 1) || hasValue(assertMessage)) {
        existsParam = `{ count: ${lengthValue} }`;
      }
      domExpression = `exists(${joinParams(existsParam, assertMessage)})`;
    }
    return `assert.dom(${domSelector}).${domExpression};`;
  }
}];
