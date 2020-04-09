# cleanup-imports


## Usage

```
npx @freshworks/ember-codemods cleanup-imports path/of/files/ or/some**/*glob.js

# or

yarn global add @freshworks/ember-codemods
@freshworks/ember-codemods cleanup-imports path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/cleanup-imports/__testfixtures__/basic.input.js)</small>):
```js
import { expect } from 'chai';
import { describe, it, context, beforeEach, afterEach, before, after } from 'mocha';
import { setupTest, setupWindowMock, setupApplicationTest } from '@freshdesk/test-helpers';
import { faker } from 'ember-cli-mirage';
import { run } from '@ember/runloop';
import {
  SWITCHER_OPTIONS as switcherOptions
} from 'freshdesk/constants/automations';

let name = faker.name.firstName();

describe('Integration | Component test', function() {
  let hooks;
  hooks = setupTest();

  switcherOptions();

  // ...
});

describe('Integration | Component test', function() {
  let hooks, router, route, transitionTo;
  hooks = setupTest();

  // ...
});

```

**Output** (<small>[basic.output.js](transforms/cleanup-imports/__testfixtures__/basic.output.js)</small>):
```js
import { describe } from 'mocha';
import { setupTest } from '@freshdesk/test-helpers';
import { faker } from 'ember-cli-mirage';
import {
  SWITCHER_OPTIONS as switcherOptions
} from 'freshdesk/constants/automations';

let name = faker.name.firstName();

describe('Integration | Component test', function() {
  let hooks;
  hooks = setupTest();

  switcherOptions();

  // ...
});

describe('Integration | Component test', function() {
  let hooks, router, route, transitionTo;
  hooks = setupTest();

  // ...
});

```
<!--FIXTURES_CONTENT_END-->