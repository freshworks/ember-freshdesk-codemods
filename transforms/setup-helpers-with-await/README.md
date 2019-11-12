# setup-helpers-with-await


## Usage

```
npx ember-freshdesk-codemods setup-helpers-with-await path/of/files/ or/some**/*glob.js

# or

yarn global add ember-freshdesk-codemods
ember-freshdesk-codemods setup-helpers-with-await path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [advanced](#advanced)
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="advanced">**advanced**</a>

**Input** (<small>[advanced.input.js](transforms/setup-helpers-with-await/__testfixtures__/advanced.input.js)</small>):
```js
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

```

**Output** (<small>[advanced.output.js](transforms/setup-helpers-with-await/__testfixtures__/advanced.output.js)</small>):
```js
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

```
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/setup-helpers-with-await/__testfixtures__/basic.input.js)</small>):
```js
import { setupCurrentAccount, setupCurrentUser } from '@freshdesk/test-helpers';

it('Setup current-account', function() {
  setupCurrentAccount(this, {
    language: 'en'
  });

  setupCurrentUser(this, {
    language: 'en'
  });

  stubRouter(this, {
    transitionToStub: this.transitionToSpy
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

```

**Output** (<small>[basic.output.js](transforms/setup-helpers-with-await/__testfixtures__/basic.output.js)</small>):
```js
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

```
<!--FIXTURES_CONTENT_END-->