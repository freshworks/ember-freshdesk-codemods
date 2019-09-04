import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import {
  setupTranslations,
  setupAcceptance
} from '@freshdesk/test-helpers';

describe.skip('Some test', function() {
  setupAcceptance();
  setupTranslations(true);

  beforeEach(function() {
    // ...
  });

  afterEach(function() {
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
