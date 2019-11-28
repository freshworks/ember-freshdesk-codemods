import { module, test } from 'qunit';
import {
  setupTest,
  setupWindowMock,
  setupApplicationTest
} from '@freshdesk/test-helpers';
import { faker } from 'ember-cli-mirage';
import { run } from '@ember/runloop';

let name = faker.name.firstName();

module('Integration | Component test', function(hooks) {
  setupTest(hooks);

  // ...
});

module('Integration | Component test', function(hooks) {
  let router, route, transitionTo;
  setupTest(hooks);

  // ...
});

module('Integration | Component', function(hooks) {
  setupApplicationTest(hooks);
  setupTest(hooks);
  setupWindowMock(hooks);

  module('Context test turns to module', function(hooks) {

    hooks.beforeEach(function() {
      // Testing for beforeEach with hooks
    });

    test('Testing await done', async function(assert) {
      assert.notEqual(false, true);
    });

    test('basic negative expect statements', async function(assert) {
      assert.notEqual(false, true);
      assert.notEqual(false, true, 'Message');
      assert.notEqual(true, false);
      assert.notEqual(true, false, 'Message');
      assert.notEqual(1, 2);
      await assert.notEqual(1, 2, 'Message');

      assert.notOk('Test', 'Message');
      assert.ok('Test', 'not empty assertion');

      // Variations in dom assertions
      await assert.dom('[data-test-id=page-title]').doesNotExist();

      return assert.dom('[data-test-id=page-title]').exists();
    });

    test('Method with return expression', function(assert) {
      run.later(() => {
        try {
          assert.equal(scrollSpy.calledOnce, true);
        } catch(err) {}
      }, 100);

      return wait(() => {
        assert.dom('[data-test-id=page-title]').exists();
      });
    });
  });

  module('Context test turns to module', function(hooks) {

    hooks.beforeEach(function() {
      // Testing for beforeEach with hooks
    });

    hooks.afterEach(function() {
      // Testing for afterEach without hooks attribute
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
});
