import { setupCurrentAccount, setupCurrentUser } from '@freshdesk/test-helpers';

it('Setup current-account', function() {
  setupCurrentAccount(this, {
    language: 'en'
  });

  setupCurrentUser(this, {
    language: 'en'
  });

  // ...
});

it('Setup current-account with await', async function() {
  await setupCurrentAccount(this, {
    language: 'en'
  });

  await setupCurrentUser(this, {
    language: 'en'
  });

  // ...
});
