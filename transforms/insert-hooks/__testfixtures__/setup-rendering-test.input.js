import { describe, it } from 'mocha';
import { setupRenderingWithMirage } from 'ember-mocha';
import { setupTranslations, setupSinonSandbox } from '@freshdesk/test-helpers';

describe('Some test', function() {
  setupRenderingWithMirage();
  setupTranslations(true);

  it('Some test', function() {
    // ...
  });
});
