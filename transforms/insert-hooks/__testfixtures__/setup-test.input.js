import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import { setupTranslations } from '@freshdesk/test-helpers';

describe('Some test', function() {
  setupTest();
  setupTranslations(true);

  it('Some test', function() {
    // ...
  });
});
