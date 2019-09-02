import { describe, it } from 'mocha';
import { setupRenderingTest } from 'ember-mocha';
import { setupTranslations } from '@freshdesk/test-helpers';

describe('Some test', function() {
  let hooks = setupRenderingTest();
  setupTranslations(hooks);

  it('Some test', function() {
    // ...
  });
});
