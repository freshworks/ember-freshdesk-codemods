import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import { setupTranslations } from '@freshdesk/test-helpers';

describe('Some test', function() {
  let hooks = setupTest();
  setupTranslations(hooks);

  it('Some test', function() {
    // ...
  });
});
