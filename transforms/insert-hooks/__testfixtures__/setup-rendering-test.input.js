import { describe, it } from 'mocha';
import { setupRenderingTest } from 'ember-mocha';
import { setupTranslations } from '@freshdesk/test-helpers';

describe('Some test', function() {
  setupRenderingTest();
  setupTranslations(true);

  it('Some test', function() {
    // ...
  });
});
