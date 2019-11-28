import { expect } from 'chai';
import { describe, it, context } from 'mocha';
import { setupTest, setupWindowMock, setupApplicationTest } from '@freshdesk/test-helpers';
import { faker } from 'ember-cli-mirage';
import { run } from '@ember/runloop';

let name = faker.name.firstName();

describe('Integration | Component test', function() {
  let hooks;
  hooks = setupTest();

  // ...
});

describe('Integration | Component test', function() {
  let hooks, router, route, transitionTo;
  hooks = setupTest();

  // ...
});

describe('Integration | Component', function() {
  let hooks = setupApplicationTest();
  setupTest();
  setupWindowMock(hooks);

  context('Context test turns to module', function() {

    beforeEach(function() {
      // Testing for beforeEach with hooks
    });

    it('Testing await done', async function(done) {
      expect(false).to.not.be.true;
      await done();
    });

    it('basic negative expect statements', async function() {
      expect(false).to.not.be.true;
      expect(false, 'Message').to.not.be.true;
      expect(true).to.not.be.false;
      expect(true, 'Message').to.not.be.false;
      expect(1).to.not.equal(2);
      await expect(1, 'Message').to.not.equal(2);

      expect('Test', 'Message').to.not.be.ok;
      expect('Test', 'not empty assertion').to.not.be.empty;

      // Variations in dom assertions
      await expect(find('[data-test-id=page-title]')).to.be.not.ok;

      return expect(findAll('[data-test-id=page-title]')).to.not.be.empty;
    });

    it('Method with return expression', function() {
      run.later(() => {
        try {
          expect(scrollSpy.calledOnce).to.be.true;
          done();
        } catch(err) {
          done(err);
        }
      }, 100);

      return wait(() => {
        expect(findAll('[data-test-id=page-title]')).to.not.be.empty;
      });
    });
  });

  context('Context test turns to module', function() {

    hooks.beforeEach(function() {
      // Testing for beforeEach with hooks
    });

    afterEach(function() {
      // Testing for afterEach without hooks attribute
    });

    it('Expect within a nested block', function(done) {
      // Comment
      [true, true].forEach((key) => {
        // Inner Comment
        expect(item).to.be.true;
      });

      [true, true].forEach(function(item) {
        // Inner Comment
        expect(item).to.be.true;
      });

      // Will this be a problem
      done();
    });
  });
});
