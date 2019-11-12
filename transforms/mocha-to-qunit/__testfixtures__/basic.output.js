import { module, test } from 'qunit';
import { find } from '@ember/test-helpers';
import {
  setupRenderingForModule,
  setupWindowMock
} from '@freshdesk/test-helpers';

module('Integration | Component', function(hooks) {
  setupRenderingForModule(hooks);
  setupWindowMock(hooks);

  test('basic expect statements', async function(assert) {
    // Simple true validation
    assert.equal(true, true);
    assert.equal(true, true, 'expect with message');
    assert.ok('Test');
    assert.ok('Test', 'With message');

    // Simple false validation
    assert.equal(false, false);
    assert.equal(false, false, 'expect with message');

    // Empty checks
    assert.notOk('', 'empty string');
    assert.notOk(Array.from([]).length, 'empty array');
    assert.notOk(Object.keys({}).length, 'empty object');
    assert.ok(Array.from([1, 2]).length, 'non empty array');
    assert.ok(Object.keys({"name": "freshworks"}).length, 'non empty object');

    // Variations in equal assertion
    assert.equal(true, true);
    assert.equal(find('[data-test-id=page-title]').innerText.trim(), '[Expected] Page Title', '[Message] Expression with message');
    assert.equal(window.location.pathname, '/support/login');

    // Variations in length
    // Find out if its a dom present case or not present case
    assert.dom('[data-test-id=page-title]').exists({ count: 2 }, '[Message] Multiple elements should be present');
    assert.dom('[data-test-id=page-title]').exists();
    assert.dom('[data-test-id=page-title]').exists({ count: 1 }, '[Message] One Element Present'); // With message and length 1
    assert.dom('[data-test-id=page-title]').doesNotExist('[Message] Element not present');
    assert.dom('[data-test-id=page-title]').doesNotExist(); // Without message
  });

  test('basic negative expect statements', function(assert) {
    assert.notEqual(false, true);
    assert.notEqual(false, true, 'Message');
    assert.notEqual(true, false);
    assert.notEqual(true, false, 'Message');

    assert.notOk('Test', 'Message');
  });

  test('Expect within a nested block', function(assert) {
    // Comment
    [true, true].forEach((key) => {
      // Inner Comment
      assert.equal(item, true);
    });

    [true, true].forEach(function(item) {
      // Inner Comment
      assert.equal(item, true);
    });

  });
});
