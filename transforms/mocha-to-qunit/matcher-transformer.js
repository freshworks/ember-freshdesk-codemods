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
    return expression.property && ['ok', 'empty', 'exist', 'present', 'undefined', 'null', 'nil'].includes(expression.property.name);
  },
  transformer: function (expression, path, j) {
    var {
      assertArgumentSource,
      assertArgument,
      assertMessage,
      hasShouldNot,
      hasSelectorWithoutProperty
    } = extractExpect(path, j);

    if(['empty', 'undefined', 'null', 'nil'].includes(expression.property.name)) {
      hasShouldNot = !hasShouldNot;
    }

    if (hasSelectorWithoutProperty) {
      return constructDomExists(j, assertArgument, assertMessage, !hasShouldNot, undefined);
    } else {
      var assertMethod = hasShouldNot ? 'notOk' : 'ok';
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
    return expression.callee && expression.callee.property.name.includes('length');
  },
  transformer: function (expression, path, j) {
    var { assertArgument, assertArgumentSource, assertMessage, hasSelectorWithoutProperty } = extractExpect(path, j);

    var lengthValue = j(expression.arguments[0]).toSource();

    if (hasSelectorWithoutProperty) {
      return constructDomExists(j, assertArgument, assertMessage, lengthValue != 0, lengthValue);
    } else {
      return `assert.length(${joinParams(assertArgumentSource, lengthValue, assertMessage)});`;
    }
  }
}, {
  name: 'expected-contains-or-includes-or-string',
  /* expect(result)
     .to.be.contains,
     .to.contain,
     .to.be.oneOf,
     .to.not.be.oneOf,
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
    return ['contain', 'contains', 'include', 'includes', 'string', 'oneOf'].includes(name);
  },
  transformer: function (expression, path, j) {
    var { assertArgumentSource, assertMessage, hasShouldNot } = extractExpect(path, j);
    var expectedArgument = j(expression.arguments).toSource();

    var assertMethod = hasShouldNot ? 'notIncludes' : 'includes';
    var assertArguments = (expression.callee.property.name === 'oneOf')
                          ? joinParams(expectedArgument, assertArgumentSource, assertMessage)
                          : joinParams(assertArgumentSource, expectedArgument, assertMessage);

    return `assert.${assertMethod}(${assertArguments});`;
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
    return expression.callee && ['lt', 'below', 'lte', 'gt', 'above', 'gte', 'least', 'most'].includes(expression.callee.property.name);
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
      case 'most':
        assertMethod = `lte`;
        break;
      case 'gte':
      case 'least':
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
    return (expression.callee && ['attr', 'attribute', 'class', 'text', 'value', 'prop'].includes(expression.callee.property.name))
      || (expression.property && ['visible', 'disabled', 'enabled'].includes(expression.property.name));
  },
  transformer: function (expression, path, j) {

    var {
      assertArgument,
      assertMessage,
      hasShouldNot,
      hasSelector,
      hasSelectorWithoutProperty
    } = extractExpect(path, j);

    var property = expression.property || expression.callee.property;
    var assertType = property.name;

    var expectedArguments = expression.arguments;

    if (hasSelectorWithoutProperty || !hasSelector) {
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
  // expect().to.be.instanceOf;
  matcher: function (expression) {
    return (expression.callee && ['a', 'an', 'instanceof'].includes(expression.callee.property.name));
  },
  transformer: function (expression, path, j) {
    var {
      assertArgumentSource,
      assertMessage
    } = extractExpect(path, j);
    let expectedArgument = expression.arguments[0].value || expression.arguments[0].name.toLowerCase();
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
}, {
  name: 'expected-keys',
  // expect(true).to.include.all.keys(true);
  // expect(true).to.have.keys(true);
  // expect(true).to.have.property(true);
  matcher: function(expression) {
    return (expression.callee && ['keys', 'property', 'members'].includes(expression.callee.property.name));
  },
  transformer: function (expression, path, j) {
    let { assertArgumentSource, assertMessage, hasShouldNot } = extractExpect(path, j);
    let expectedArgument = (expression.callee.property.name === 'members') ? j(expression.arguments).toSource() : `[${j(expression.arguments).toSource()}]`;
    let assertMethod = hasShouldNot ? 'notDeepIncludes': 'deepIncludes';
    return `assert.${assertMethod}(${joinParams(assertArgumentSource, expectedArgument, assertMessage)});`;
  }
}, {
  name: 'expected-throws',
  // expect(function).to.throw(error);
  matcher: function(expression) {
    return (expression.callee && expression.callee.property.name === 'throw');
  },
  transformer: function (expression, path, j) {
    var { assertArgumentSource, assertMessage, hasShouldNot } = extractExpect(path, j);
    var expectedArgument = j(expression.arguments).toSource();
    let assertMethod = (hasShouldNot) ? 'ok' : 'throws';
    let assertArgs = (hasShouldNot) ? joinParams(assertArgumentSource, assertMessage) : joinParams(assertArgumentSource, expectedArgument, assertMessage);
    return `assert.${assertMethod}(${assertArgs});`;
  }
}, {
  name: 'expected-called',
  // expect(spy()).to.have.been.called;
  matcher: function(expression) {
    return (expression.property && expression.property.name === 'called');
  },
  transformer: function (expression, path, j) {
    var { assertArgumentSource, assertMessage, hasShouldNot } = extractExpect(path, j);
    let selector = `${assertArgumentSource}.called`;
    let assertArgs = joinParams(selector, !hasShouldNot, assertMessage);
    return `assert.equal(${assertArgs});`;
  }
}
];
