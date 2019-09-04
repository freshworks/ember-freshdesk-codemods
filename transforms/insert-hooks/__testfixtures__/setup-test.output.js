import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import {
  setupTranslations,
  setupSinonSandbox
} from '@freshdesk/test-helpers';

describe('Some test', function() {
  let hooks = setupTest();
  setupTranslations(hooks);
  setupSinonSandbox(hooks);

  it('Some test', function() {
    // ...
  });
});
