import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import { setupTranslations, setupSinonSandbox } from '@freshdesk/test-helpers';

describe('Some test', function() {
  setupTest();
  setupTranslations(true);
  setupSinonSandbox();

  it('Some test', function() {
    // ...
  });
});
