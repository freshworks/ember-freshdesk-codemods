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
* [import](#import)
* [runloop-grouping](#runloop-grouping)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
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

import { run } from '@ember/runloop';

describe('Integration | Component | app-components/from-email', function() {
  
  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
    run(() => {
      this.get('store').createRecord('contact', contact);
    });
  });

});

```
---
<a id="runloop-grouping">**runloop-grouping**</a>

**Input** (<small>[runloop-grouping.input.js](transforms/async-leaks/__testfixtures__/runloop-grouping.input.js)</small>):
```js
import { describe, it } from 'mocha';

describe('Integration | Component | app-components/from-email', function() {
  
  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
    this.get('store').createRecord('contact', contact); // comments
    let ticketsCount = 1;
    this.get('store').createRecord('ticket', ticket);
    this.get('store').createRecord('agent', agent);
  });

  it('should group run loops and bring their variable declarations to correct block scope', function() {
    get(this, 'store').pushPayload('contact', { contact: userContact.attrs });
    const test = get(this, 'store').findAll('agents');    
    this.store.findAll('tickets');
    run(async () => {
      await this.get('store').pushPayload('agent', agents);
      const agent = this.get('store').pushPayload('agent', agents);
    });
    server.createList('email-config', 20);
    server.create('email-config', { name: 'Test', reply_email: 'test@gmail.com' });
    this.get('store').findRecord('modals');
    run(async () => {
      await get(this, 'store').findAll('agents');
    });    
  });

  it('Should not disturb the following store operations and the operations which are already has run loop', async function() {
    run(() => {
      get(this, 'store').findAll('todos');
    });
    server.createList('email-config', 101);
    server.create('email-config', { name: 'Test', reply_email: 'test@gmail.com' });
    get(this, 'store').peekAll('tickets');
    get(this, 'store').peekRecord('ticket');
    await run(() => {
      this.get('store').pushPayload('agent', agents);
    });
  });

});

```

**Output** (<small>[runloop-grouping.output.js](transforms/async-leaks/__testfixtures__/runloop-grouping.output.js)</small>):
```js
import { describe, it } from 'mocha';

import { run } from '@ember/runloop';

describe('Integration | Component | app-components/from-email', function() {
  
  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
    run(() => {
      this.get('store').createRecord('contact', contact); // comments
    });
    let ticketsCount = 1;
    run(() => {
      this.get('store').createRecord('ticket', ticket);
      this.get('store').createRecord('agent', agent);
    });
  });

  it('should group run loops and bring their variable declarations to correct block scope', function() {
    const test;
    const agent;
    run(async () => {
      get(this, 'store').pushPayload('contact', { contact: userContact.attrs });
      test = get(this, 'store').findAll('agents');
      this.store.findAll('tickets');
      await this.get('store').pushPayload('agent', agents);
      agent = this.get('store').pushPayload('agent', agents);
    });

    server.createList('email-config', 20);
    server.create('email-config', { name: 'Test', reply_email: 'test@gmail.com' });

    run(async () => {
      this.get('store').findRecord('modals');
      await get(this, 'store').findAll('agents');
    });
  });

  it('Should not disturb the following store operations and the operations which are already has run loop', async function() {
    run(() => {
      get(this, 'store').findAll('todos');
    });
    server.createList('email-config', 101);
    server.create('email-config', { name: 'Test', reply_email: 'test@gmail.com' });
    get(this, 'store').peekAll('tickets');
    get(this, 'store').peekRecord('ticket');
    await run(() => {
      this.get('store').pushPayload('agent', agents);
    });
  });

});

```
<!--FIXTURES_CONTENT_END-->