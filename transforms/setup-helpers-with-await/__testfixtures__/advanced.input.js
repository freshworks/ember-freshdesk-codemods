import { describe } from 'mocha';

import {
  setupCurrentAccount,
  setupCurrentUser,
  setupRenderingWithMirage
} from '@freshdesk/test-helpers';

describe('Integration | Component | audit-log | module-admin/audit-log', function() {
  let hooks = setupRenderingWithMirage();

  hooks.beforeEach(function() {
    setupCurrentAccount(this, {
      launched: ['abc']
    });

    setupCurrentUser(this);
  });
});
