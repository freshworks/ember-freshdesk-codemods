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
* [setup-rendering-test](#setup-rendering-test)
* [setup-test](#setup-test)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="setup-rendering-test">**setup-rendering-test**</a>

**Input** (<small>[setup-rendering-test.input.js](transforms/insert-hooks/__testfixtures__/setup-rendering-test.input.js)</small>):
```js
import { describe, it } from 'mocha';
import { setupRenderingTest } from 'ember-mocha';
import { setupTranslations } from '@freshdesk/test-helpers';

describe('Some test', function() {
  setupRenderingTest();
  setupTranslations(true);

  it('Some test', function() {
    // ...
  });
});

```

**Output** (<small>[setup-rendering-test.output.js](transforms/insert-hooks/__testfixtures__/setup-rendering-test.output.js)</small>):
```js
import { describe, it } from 'mocha';
import { setupRenderingTest } from 'ember-mocha';
import { setupTranslations } from '@freshdesk/test-helpers';

describe('Some test', function() {
  let hooks = setupRenderingTest();
  setupTranslations(hooks);

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
import { setupTranslations } from '@freshdesk/test-helpers';

describe('Some test', function() {
  setupTest();
  setupTranslations(true);

  it('Some test', function() {
    // ...
  });
});

```

**Output** (<small>[setup-test.output.js](transforms/insert-hooks/__testfixtures__/setup-test.output.js)</small>):
```js
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import { setupTranslations } from '@freshdesk/test-helpers';

describe('Some test', function() {
  let hooks = setupTest();
  setupTranslations(hooks);

  it('Some test', function() {
    // ...
  });
});

```
<!--FIXTURES_CONTENT_END-->