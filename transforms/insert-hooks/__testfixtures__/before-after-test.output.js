import { describe, it, beforeEach } from 'mocha';
import { setupAcceptance } from '@freshdesk/test-helpers';

describe.skip('Some test', function() {
  let hooks = setupAcceptance();

  hooks.beforeEach(function() {
    // ...
  });

  hooks.afterEach(function() {
    // ...
  });

  it('Some test', function() {
    // ...
  });

  context('Testing withing context', function() {
    // Should not add hook in beforeEach within a context
    beforeEach(function() {
      // ...
    });
  });
});
