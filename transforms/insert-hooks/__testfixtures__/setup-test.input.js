import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import { setupTranslations, setupSinonSandbox } from '@freshdesk/test-helpers';

describe('Some test', function() {
  setupTest();
  setupTranslations(true);
  setupSinonSandbox();

  setupSolution({
    isDefaultLocale: true
  });

  setupSolution();

  it('Some test', function() {
    // ...
  });
});
