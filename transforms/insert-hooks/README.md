# insert-hooks


## Usage

```
npx ember-freshdesk-codemods insert-hooks path/of/files/ or/some**/*glob.js

# or

yarn global add ember-freshdesk-codemods
ember-freshdesk-codemods insert-hooks path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [before-after-test](#before-after-test)
* [setup-rendering-test](#setup-rendering-test)
* [setup-test](#setup-test)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="before-after-test">**before-after-test**</a>

**Input** (<small>[before-after-test.input.js](transforms/insert-hooks/__testfixtures__/before-after-test.input.js)</small>):
```js
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import {
  setupTranslations,
  setupAcceptance
} from '@freshdesk/test-helpers';

describe.skip('Some test', function() {
  setupAcceptance();
  setupTranslations(true);

  beforeEach(function() {
    // ...
  });

  afterEach(function() {
    // ...
  });

  it('Some test', function() {
    // ...
  });

  context('Testing withing context', function() {
    // Should not add hook in beforeEach within a context
    beforeEach(function() {
      // ...
    });
  });
});

```

**Output** (<small>[before-after-test.output.js](transforms/insert-hooks/__testfixtures__/before-after-test.output.js)</small>):
```js
import { describe, it, beforeEach } from 'mocha';
import { setupAcceptance } from '@freshdesk/test-helpers';

describe.skip('Some test', function() {
  let hooks = setupAcceptance();

  hooks.beforeEach(function() {
    // ...
  });

  hooks.afterEach(function() {
    // ...
  });

  it('Some test', function() {
    // ...
  });

  context('Testing withing context', function() {
    // Should not add hook in beforeEach within a context
    beforeEach(function() {
      // ...
    });
  });
});

```
---
<a id="setup-rendering-test">**setup-rendering-test**</a>

**Input** (<small>[setup-rendering-test.input.js](transforms/insert-hooks/__testfixtures__/setup-rendering-test.input.js)</small>):
```js
import { describe, it } from 'mocha';
import { setupRenderingWithMirage } from 'ember-mocha';
import { setupTranslations, setupSinonSandbox } from '@freshdesk/test-helpers';

describe('Some test', function() {
  setupRenderingWithMirage();
  setupTranslations(true);

  it('Some test', function() {
    // ...
  });
});

```

**Output** (<small>[setup-rendering-test.output.js](transforms/insert-hooks/__testfixtures__/setup-rendering-test.output.js)</small>):
```js
import { describe, it } from 'mocha';
import { setupRenderingWithMirage } from 'ember-mocha';

describe('Some test', function() {
  setupRenderingWithMirage();

  it('Some test', function() {
    // ...
  });
});

```
---
<a id="setup-test">**setup-test**</a>

**Input** (<small>[setup-test.input.js](transforms/insert-hooks/__testfixtures__/setup-test.input.js)</small>):
```js
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import { setupTranslations, setupSinonSandbox } from '@freshdesk/test-helpers';

describe('Some test', function() {
  setupTest();
  setupTranslations(true);
  setupSinonSandbox();

  setupSolution({
    isDefaultLocale: true
  });

  setupSolution();

  it('Some test', function() {
    // ...
  });
});

```

**Output** (<small>[setup-test.output.js](transforms/insert-hooks/__testfixtures__/setup-test.output.js)</small>):
```js
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

  setupSolution(hooks, {
    isDefaultLocale: true
  });

  setupSolution(hooks);

  it('Some test', function() {
    // ...
  });
});

```
<!--FIXTURES_CONTENT_END-->