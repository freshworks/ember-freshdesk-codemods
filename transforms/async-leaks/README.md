# async-leaks


## Usage

```
npx ember-freshdesk-codemods async-leaks path/of/files/ or/some**/*glob.js

# or

yarn global add ember-freshdesk-codemods
ember-freshdesk-codemods async-leaks path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
* [import](#import)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/async-leaks/__testfixtures__/basic.input.js)</small>):
```js
import { run } from '@ember/runloop';
import { describe, it } from 'mocha';

describe('Integration | Component | app-components/from-email', function() {
  
  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
    this.get('store').createRecord('contact', contact);
  });

  it('should add run loop', async function() {
    server.createList('email-config', 20);
    server.create('email-config', { name: 'Test', reply_email: 'test@gmail.com' });

    get(this, 'store').pushPayload('contact', { contact: agentContact.attrs  });
    get(this, 'store').pushPayload('contact', { contact: userContact.attrs  });
  });

  it('should ignore existing run loop', async function() {
    server.createList('email-config', 101);
    server.create('email-config', { name: 'Test', reply_email: 'test@gmail.com' });

    await run(() => {
      this.get('store').pushPayload('agent', agents);
    });
  });

});

```

**Output** (<small>[basic.output.js](transforms/async-leaks/__testfixtures__/basic.output.js)</small>):
```js
import { run } from '@ember/runloop';
import { describe, it } from 'mocha';

describe('Integration | Component | app-components/from-email', function() {
  
  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
    run(() => {
      this.get('store').createRecord('contact', contact);
    });
  });

  it('should add run loop', async function() {
    server.createList('email-config', 20);
    server.create('email-config', { name: 'Test', reply_email: 'test@gmail.com' });

    run(() => {
      get(this, 'store').pushPayload('contact', { contact: agentContact.attrs  });
      get(this, 'store').pushPayload('contact', { contact: userContact.attrs  });
    });
  });

  it('should ignore existing run loop', async function() {
    server.createList('email-config', 101);
    server.create('email-config', { name: 'Test', reply_email: 'test@gmail.com' });

    await run(() => {
      this.get('store').pushPayload('agent', agents);
    });
  });

});

```
---
<a id="import">**import**</a>

**Input** (<small>[import.input.js](transforms/async-leaks/__testfixtures__/import.input.js)</small>):
```js
import { describe } from 'mocha';

describe('Integration | Component | app-components/from-email', function() {
  
  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
    this.get('store').createRecord('contact', contact);
  });

});

```

**Output** (<small>[import.output.js](transforms/async-leaks/__testfixtures__/import.output.js)</small>):
```js
import { describe } from 'mocha';

import { run } from "@ember/runloop";

describe('Integration | Component | app-components/from-email', function() {
  
  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
    run(() => {
      this.get('store').createRecord('contact', contact);
    });
  });

});

```
<!--FIXTURES_CONTENT_END-->