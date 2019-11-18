const { hasValue, joinParams, extractExpect, constructDomExists, constructDomAssertions, findIdentifier } = require('./utils');

module.exports = [{
  name: 'expected-true-or-false',
  /* expect()
    .to.be.true,
    .to.be.false,
    .to.be.not.true,
    .to.be.not.false
  */
  matcher: function(expression, path, j) {
    return expression.property && ['true', 'false'].includes(expression.property.name);
  },
  transformer: function(expression, path, j) {
    var {
      assertArgumentSource,
      assertMessage,
      hasShouldNot
    } = extractExpect(path, j);

    var assertMethod = hasShouldNot ? 'notEqual': 'equal';
    var assertValue = expression.property.name === 'true';

    return `assert.${assertMethod}(${joinParams(assertArgumentSource, assertValue, assertMessage)});`;
  }
}, {
  name: 'expected-ok-or-empty-or-exists-or-present-or-undefined',
  /* expect()
    .to.be.ok,
    .to.be.not.ok,
    .to.be.empty,
    .to.be.not.empty,
    .to.be.exist,
    .to.not.be.exist,
    .to.be.present,
    .to.be.not.present,
    .to.be.undefined
  */
  matcher: function (expression) {
    return expression.property && ['ok', 'empty', 'exist', 'present', 'undefined'].includes(expression.property.name);
  },
  transformer: function (expression, path, j) {
    var {
      assertArgumentSource,
      assertArgument,
      assertMessage,
      hasShouldNot,
      hasSelectorWithoutProperty
    } = extractExpect(path, j);

    if(['empty', 'undefined'].includes(expression.property.name)) {
      hasShouldNot = !hasShouldNot;
    }

    if (hasSelectorWithoutProperty) {
      return constructDomExists(j, assertArgument, assertMessage, !hasShouldNot, 1);
    } else {
      var assertMethod = hasShouldNot ? 'notOk' : 'ok';
      return `assert.${assertMethod}(${joinParams(assertArgumentSource, assertMessage)});`;
    }
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
       hasSelectorWithoutProperty
     } = extractExpect(path, j);

     if (hasSelectorWithoutProperty) {
       // not.be.null will be dom exists assertion hence hasShouldNot
       return constructDomExists(j, assertArgument, assertMessage, hasShouldNot, 1);
     } else {
       var assertMethod = hasShouldNot ? 'ok': 'notOk';
       return `assert.${assertMethod}(${joinParams(assertArgumentSource, assertMessage)});`;
     }
   }
}, {
  name: 'expected-equal',
  // expect(true)
  //  .to.equal(true);
  //  .to.equals(true);
  //  .to.eq(true);
  // expect(1).to.not.equal(2);
  // expect({key: value})
  //  .to.deep.equal({key: value});
  //  .to.eql({key: value});
  //  .to.not.deep.equal({key: someOthervalue});
  matcher: function(expression) {
    return (expression.callee && ['equal', 'eql', 'eq', 'equals'].includes(expression.callee.property.name));
  },
  transformer: function (expression, path, j) {
    var { assertArgumentSource, hasShouldNot, assertMessage } = extractExpect(path, j);
    var expectedArgument = j(expression.arguments).toSource();
    var assertMethod;
    var hasDeepAssertion = findIdentifier(path, j, 'deep');

    if(expression.callee.property.name === 'eql' || hasDeepAssertion) {
      assertMethod = hasShouldNot ? 'notDeepEqual': 'deepEqual';
    } else {
      assertMethod = hasShouldNot ? 'notEqual': 'equal';
    }

    return `assert.${assertMethod}(${joinParams(assertArgumentSource, expectedArgument, assertMessage)});`;
  }
}, {
  name: 'expected-length',
  // expect(findAll('[data-test-id=page-title]')).to.have.length(1);
  matcher: function(expression) {
    return (expression.callee && expression.callee.property.name === 'length');
  },
  transformer: function (expression, path, j) {
    var { assertArgument, assertMessage, hasSelectorWithoutProperty } = extractExpect(path, j);

    var existsParam = null;
    var lengthValue = expression.arguments[0].value;
    var domSelector = j(assertArgument.arguments).toSource();

    if (hasSelectorWithoutProperty) {
      return constructDomExists(j, assertArgument, assertMessage, (lengthValue > 0), lengthValue);
    } else {
      // NOTE need to handle the length method that is not used for findAll;
      return j(expression).toSource();
    }
  }
}, {
   name: 'expected-contains-or-includes-or-string',
   /* expect(result)
      .to.be.contains,
      .to.contain,
      .to.have.contain,
      .to.be.contain,
      .to.contains,
      .to.not.contain,
      .to.not.contains,
      .to.includes,
      .to.not.includes,
      .to.include,
      .to.not.include,
      .to.have.string,
      .to.not.have.string
   */
   matcher: function(expression) {
     let name = (expression.callee && expression.callee.property.name) || '';
     return name.includes('contain') || name.includes('include') || name === 'string';
   },
   transformer: function (expression, path, j) {
     var { assertArgumentSource, assertMessage, hasShouldNot } = extractExpect(path, j);
     var expectedArgument = j(expression.arguments).toSource();

     var assertMethod = hasShouldNot ? 'notIncludes' : 'includes';

     return `assert.${assertMethod}(${joinParams(assertArgumentSource, expectedArgument, assertMessage)});`;
   }
}, {
  name: 'expected-lt-lte-below-gt-gte-above',
  /* expect()
    .to.be.lt,
    .to.be.lte,
    .to.be.below,
    .to.be.gt,
    .to.be.gte,
    .to.be.above
  */
  matcher: function (expression) {
    return expression.callee && ['lt', 'below', 'lte', 'gt', 'above', 'gte'].includes(expression.callee.property.name);
  },
  transformer: function (expression, path, j) {
    var {
      assertArgumentSource,
      assertMessage
    } = extractExpect(path, j);
    var expectedArgument = j(expression.arguments).toSource();
    let assertMethod;

    switch(expression.callee.property.name) {
      case 'lt':
      case 'below':
        assertMethod = `lt`;
        break;
      case 'gt':
      case 'above':
        assertMethod = `gt`;
        break;
      case 'lte':
        assertMethod = `lte`;
        break;
      case 'gte':
        assertMethod = `gte`;
        break;
    }

    return `assert.${assertMethod}(${joinParams(assertArgumentSource, expectedArgument, assertMessage)})`;
  }
},{
  name: 'expected-dom-specific-assertions',
  // expect(find('[data-test-id=page-title]')).to.have.attr('href', 'link');
  // expect(find('[data-test-id=page-title]')).to.have.attribute('aria-label', 'label');
  // expect(find('[data-test-id=page-title]')).to.not.have.attr('disabled');
  // expect(find('[data-test-id=page-title]')).to.have.class('text--bold');
  // expect(find('[data-test-id=page-title]')).to.have.text('input');
  // expect(find('[data-test-id=page-title]')).to.have.value('input');
  // expect(find('[data-test-id=page-title]')).to.be.visible;
  // expect(find('[data-test-id=page-title]')).to.be.disabled;
  matcher: function(expression) {
    return (expression.callee && ['attr', 'attribute', 'class', 'text', 'value'].includes(expression.callee.property.name))
      || (expression.property && ['visible', 'disabled'].includes(expression.property.name));
  },
  transformer: function (expression, path, j) {

    var {
      assertArgument,
      assertMessage,
      hasShouldNot,
      hasSelectorWithoutProperty
    } = extractExpect(path, j);

    var property = expression.property || expression.callee.property;
    var assertType = property.name;

    var expectedArguments = expression.arguments;

    if (hasSelectorWithoutProperty) {
      return constructDomAssertions(j, assertArgument, assertMessage, assertType, hasShouldNot, expectedArguments);
    } else {
      // NOTE This is a rare case where they have implemented chaining and then used attr or class for assertion,
      // For these cases we need to find a solution if present else do it manually
      return j(expression).toSource();
    }
  }
},{
  name: 'expected-a-an',
  // expect().to.be.a;
  // expect().to.be.an;
  matcher: function (expression) {
    return (expression.callee && ['a', 'an'].includes(expression.callee.property.name));
  },
  transformer: function (expression, path, j) {
    var {
      assertArgumentSource,
      assertMessage
    } = extractExpect(path, j);
    let expectedArgument = expression.arguments[0].value;
    let assertArgumentType;
    
    switch(expectedArgument) {
      case 'array':
        assertArgumentType = `Array`;
        break;
      case 'date':
        assertArgumentType = `Date`;
        break;
      case 'object':
        assertArgumentType = `Object`;
        break;
    }

    return `assert.instanceOf(${joinParams(assertArgumentType, assertArgumentSource, assertMessage)});`;
  }
}
];
