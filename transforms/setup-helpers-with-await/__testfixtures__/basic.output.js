import { setupCurrentAccount, setupCurrentUser } from '@freshdesk/test-helpers';

it('Setup current-account', async function() {
  await setupCurrentAccount({
    language: 'en'
  });

  await setupCurrentUser({
    language: 'en'
  });

  stubRouter({
    transitionToStub: this.transitionToSpy
  });

  // ...
});

it('Setup current-account with await', async function() {
  await setupCurrentAccount({
    language: 'en'
  });

  await setupCurrentUser({
    language: 'en'
  });

  // ...
});
