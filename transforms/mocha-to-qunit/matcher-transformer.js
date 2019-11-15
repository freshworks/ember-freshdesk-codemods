const { hasValue, joinParams, extractExpect, constructDomExists } = require('./utils');

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
   name: 'expected-null',
   /* expect(result)
      .to.be.null,
      .to.not.null
   */
   matcher: function(expression) {
     return (expression.property && expression.property.name === 'null');
   },
   transformer: function (expression, path, j) {
     var {
       assertArgumentSource,
       assertArgument,
       assertMessage,
       hasShouldNot,
       hasSelector
     } = extractExpect(path, j);

     if (hasSelector) {
       // not.be.null will be dom exists assertion hence hasShouldNot
       return constructDomExists(j, assertArgument, assertMessage, hasShouldNot, 1);
     } else {
       var assertMethod = hasShouldNot ? 'notEmpty': 'empty';
       return `assert.${assertMethod}(${joinParams(assertArgumentSource, assertMessage)});`;
     }
   }
}, {
   name: 'expected-exists',
   /* expect(result)
      .to.be.exist,
      .to.not.be.exist
   */
   matcher: function(expression) {
     return (expression.property && expression.property.name === 'exist');
   },
   transformer: function (expression, path, j) {
     var {
       assertArgumentSource,
       assertArgument,
       assertMessage,
       hasShouldNot,
       hasSelector
     } = extractExpect(path, j);

     if (hasSelector) {
       return constructDomExists(j, assertArgument, assertMessage, !hasShouldNot, 1);
     } else {
       var assertMethod = hasShouldNot ? 'notOk': 'ok';
       return `assert.${assertMethod}(${joinParams(assertArgumentSource, assertMessage)});`;
     }
   }
}, {
  name: 'expected-empty',
  // expect(result).to.be.empty;
  matcher: function(expression) {
    return (expression.property && expression.property.name === 'empty');
  },
  transformer: function (expression, path, j) {
    var { assertArgumentSource, assertMessage } = extractExpect(path, j);

    return `assert.notOk(${joinParams(assertArgumentSource, assertMessage)});`;
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
    var { assertArgument, assertMessage, hasSelector } = extractExpect(path, j);

    var existsParam = null;
    var lengthValue = expression.arguments[0].value;
    var domSelector = j(assertArgument.arguments).toSource();
    var domExpression;

    if (hasSelector) {
      return constructDomExists(j, assertArgument, assertMessage, (lengthValue > 0), lengthValue);
    } else {
      // NOTE need to handle the length method that is not used for findAll;
      return j(expression).toSource();
    }
  }
}, {
   name: 'expected-contains',
   /* expect(result)
      .to.be.contains,
      .to.contain,
      .to.have.contain,
      .to.be.contain,
      .to.contains,
      .to.not.contain,
      .to.not.contains,
   */
   matcher: function(expression) {
     let name = (expression.callee && expression.callee.property.name) || '';
     return name.includes('contain');
   },
   transformer: function (expression, path, j) {
     var { assertArgumentSource, assertMessage, hasShouldNot } = extractExpect(path, j);
     var expectedArgument = j(expression.arguments).toSource();

     var assertMethod = hasShouldNot ? 'notIncludes' : 'includes';

     return `assert.${assertMethod}(${joinParams(assertArgumentSource, expectedArgument, assertMessage)});`;
   }
}];
