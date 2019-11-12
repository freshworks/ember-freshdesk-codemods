import { describe } from 'mocha';

import {
  setupCurrentAccount,
  setupCurrentUser,
  setupRenderingWithMirage
} from '@freshdesk/test-helpers';

describe('Integration | Component | audit-log | module-admin/audit-log', function() {
  let hooks = setupRenderingWithMirage();

  hooks.beforeEach(async function() {
    await setupCurrentAccount({
      launched: ['abc']
    });

    await setupCurrentUser();
  });
});
