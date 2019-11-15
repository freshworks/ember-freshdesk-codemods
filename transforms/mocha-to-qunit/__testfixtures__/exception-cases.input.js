import { expect } from 'chai';
import { describe, it, context } from 'mocha';
import { setupTest, setupWindowMock, setupApplicationTest } from '@freshdesk/test-helpers';

describe('Integration | Component', function() {
  let hooks = setupApplicationTest();
  setupTest();
  setupWindowMock(hooks);

  context('Context test turns to module', function() {

    beforeEach(function() {
      // Testing for beforeEach with hooks
    });

    it('basic negative expect statements', function() {
      expect(false).to.not.be.true;
      expect(false, 'Message').to.not.be.true;
      expect(true).to.not.be.false;
      expect(true, 'Message').to.not.be.false;

      expect('Test', 'Message').to.not.be.ok;
    });
  });

  context('Context test turns to module', function() {

    hooks.beforeEach(function() {
      // Testing for beforeEach with hooks
    });

    afterEach(function() {
      // Testing for afterEach without hooks attribute
    });

    it('Expect within a nested block', function() {
      // Comment
      [true, true].forEach((key) => {
        // Inner Comment
        expect(item).to.be.true;
      });

      [true, true].forEach(function(item) {
        // Inner Comment
        expect(item).to.be.true;
      });
    });
  });
});
