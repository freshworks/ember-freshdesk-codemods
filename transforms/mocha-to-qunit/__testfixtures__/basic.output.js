import { module, test } from 'qunit';
import { find } from '@ember/test-helpers';
import {
  setupTest,
  setupWindowMock,
  setupApplicationTest
} from '@freshdesk/test-helpers';

module('Integration | Component', function(hooks) {
  setupApplicationTest(hooks);
  setupTest(hooks);
  setupWindowMock(hooks);

  test('basic expect statements', async function(assert) {
    // Simple true validation
    assert.equal(true, true);
    assert.equal(true, true, 'expect with message');
    assert.ok('Test');
    assert.ok('Test', 'With message');
    assert.ok('Test');
    assert.ok('Test', 'With message');

    // Simple false validation
    assert.equal(false, false);
    assert.equal(false, false, 'expect with message');

    // Negative cases with variance
    assert.notOk(result);
    assert.notOk(result, 'With Message');
    assert.notOk(undefined);

    // Variations in equal assertion
    assert.equal(true, true);
    assert.equal(true, true);
    assert.equal(true, true);
    assert.equal(find('[data-test-id=page-title]').innerText.trim(), '[Expected] Page Title', '[Message] Expression with message');
    assert.equal(window.location.pathname, '/support/login');
    assert.deepEqual({key: value}, {key: value});
    assert.deepEqual({key: value}, {key: value}, 'Assertion Message');
    assert.deepEqual({key: value}, {key: value});
    assert.notDeepEqual({key: value}, {key: some_other_value});

    // Variations in length
    // Find out if its a dom present case or not present case
    assert.dom('[data-test-id=page-title]').exists({ count: 2 }, '[Message] Multiple elements should be present');
    assert.dom('[data-test-id=page-title]').exists();
    assert.dom('[data-test-id=page-title]').exists({ count: 1 }, '[Message] One Element Present'); // With message and length 1
    assert.dom('[data-test-id=page-title]').doesNotExist('[Message] Element not present');
    assert.dom('[data-test-id=page-title]').doesNotExist(); // Without message
    // Should handle this edge cases
    // expect(find('[data-test-id=page-titles]').querySelectorAll('[data-test-id=page-title]')).to.have.length(2);
    // expect(find('[data-test-id=page-titles]').querySelector('[data-test-id=page-title]')).to.have.length(1);

    // Variations in dom assertions
    assert.dom('[data-test-id=page-title]').exists();
    assert.dom('[data-test-id=page-title]').doesNotExist();
    assert.includes(find('[data-test-id=page-title]').getAttribute('href'), '/some/url');
    assert.equal(find('[data-test-id=page-title]').className.includes('active'), true);
    assert.ok(find('[data-test-id=page-titles]').querySelector('[data-test-id=page-title]'));
  });

  // 'dom-specific-assertions'
  test('expects various dom specific assertions', function(assert) {
    assert.dom('[data-test-id=page-title]').hasAttribute('href', 'link');
    assert.dom('[data-test-id=page-title]').hasAttribute('aria-label', 'label', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').hasAttribute('disabled');
    assert.dom('[data-test-id=page-title]').hasClass('text--bold');
    assert.dom('[data-test-id=page-title]').isDisabled();
    assert.dom('[data-test-id=page-title]').isVisible('Assertion Message');
    assert.dom('[data-test-id=page-title]').hasText('input', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').hasText('input');
    assert.dom('[data-test-id=page-title]').hasText('input');
    assert.dom('[data-test-id=page-title]').hasText('input', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').hasValue('input');

    assert.dom('[data-test-id=page-title]').doesNotHaveAttribute('disabled', 'Assertion Message');
    assert.dom('[data-test-id=page-title]').isNotDisabled();
    assert.dom('[data-test-id=page-title]').isNotVisible();
  });

  // 'expected-contains'
  test('Contains expects expected-contains', function(assert) {
    assert.includes('Message has input', 'input');
    assert.includes([1, 2], 2);
    assert.includes('Message has input', 'input', 'Assertions Message');
    assert.includes('Message has input', 'input');
    assert.includes('Message has input', 'input');

    assert.includes('Message has input', 'input');
    assert.includes('Message has input', 'input');
    assert.includes([1, 2], 2);
    assert.includes([1, 2], 2);
    assert.includes('Message has input', 'input');
    // Should handle this edge cases
    // expect(options).to.be.an('array').to.not.include(serviceTaskType);

    // Not contains
    assert.notIncludes('Message', 'input');
    assert.notIncludes('Message', 'input', 'Assertions Message');
    assert.notIncludes('Message', 'input');
    assert.notIncludes('Message', 'input', 'Assertions Message');
    assert.notIncludes('Message', 'input');
  });

  // 'expected-null'
  test('Contains expects expected-null', function(assert) {
    assert.ok('Has Value', 'message');
    assert.notOk(['Has Value'], 'message');

    // or assert.dom('selector').doesNotExist(message);
    assert.dom('dom-selector').exists({ count: 1 }, 'message');
    assert.dom('dom-selector').doesNotExist('message');
  });

  // 'expected-exists'
  test('Contains expects expected-exists', function(assert) {
    let refrence = 'Some Value';
    assert.ok('Value');
    assert.ok(['Has Value'], 'message');
    assert.ok(refrence, 'message');
    assert.notOk(refrence, 'message');

    // or assert.dom('selector').doesNotExist(message);
    assert.dom('dom-selector').exists();
    assert.dom('dom-selector').exists({ count: 1 }, 'message');
    assert.dom('dom-selector').doesNotExist('message');
  });

  // compare assertions
  test('Contains expects lt, lte, below, gt, gte, above', function(assert) {
    assert.lt(1, 2);
    assert.lt(2, 3, 'assert message');
    assert.lte(2, 2);
    
    assert.gt(1, 2);
    assert.gt(2, 3, 'assert message');
    assert.gte(2, 2);
  });

  // type check
  test('Contains expects a, an', function(assert) {
    assert.instanceOf(Array, [1,2,3]);
    assert.instanceOf(Object, {x: 1});
    let currentDateVar = new Date();
    assert.instanceOf(Date, currentDateVar);
    assert.instanceOf(Array, [1, 2]);
  });
});
