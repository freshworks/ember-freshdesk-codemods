# modify-import


## Usage

```
npx ember-codemods modify-import path/of/files/ or/some**/*glob.js

# or

yarn global add ember-codemods
ember-codemods modify-import path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
* [existing-import](#existing-import)
* [integration-helpers](#integration-helpers)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/modify-import/__testfixtures__/basic.input.js)</small>):
```js
import { describe, it } from 'mocha';
import { addFeatures, addLaunched, addAbilities } from 'freshdesk/tests/helpers/util-test-helpers';

describe('Some test', function() {
  it('Some test', function() {
    // Some test code goes here.
  });
});

```

**Output** (<small>[basic.output.js](transforms/modify-import/__testfixtures__/basic.output.js)</small>):
```js
import { describe, it } from 'mocha';
import {
  addFeatures,
  addLaunched,
  addAbilities
} from '@freshdesk/test-helpers';

describe('Some test', function() {
  it('Some test', function() {
    // Some test code goes here.
  });
});

```
---
<a id="existing-import">**existing-import**</a>

**Input** (<small>[existing-import.input.js](transforms/modify-import/__testfixtures__/existing-import.input.js)</small>):
```js
import { describe } from 'mocha';
import { addLaunched,
  addAbilities, addFeatures } from 'freshdesk/tests/helpers/util-test-helpers';
import { spyFlashMessages } from '@freshdesk/test-helpers';

describe('Some test', function () {
  it('Some test', function () {
    // Some test code goes here.
  });
});

```

**Output** (<small>[existing-import.output.js](transforms/modify-import/__testfixtures__/existing-import.output.js)</small>):
```js
import { describe } from 'mocha';
import {
  spyFlashMessages,
  addFeatures,
  addLaunched,
  addAbilities
} from '@freshdesk/test-helpers';

describe('Some test', function () {
  it('Some test', function () {
    // Some test code goes here.
  });
});

```
---
<a id="integration-helpers">**integration-helpers**</a>

**Input** (<small>[integration-helpers.input.js](transforms/modify-import/__testfixtures__/integration-helpers.input.js)</small>):
```js
import { describe, it } from 'mocha';
import {
  setupCurrentUser,
  setupCurrentAccount
} from 'freshdesk/tests/helpers/integration-test-helpers';

describe('Some test', function() {
  it('Some test', function() {
    // Some test code goes here.
  });
});

```

**Output** (<small>[integration-helpers.output.js](transforms/modify-import/__testfixtures__/integration-helpers.output.js)</small>):
```js
import { describe, it } from 'mocha';
import {
  setupCurrentUser,
  setupCurrentAccount
} from '@freshdesk/test-helpers';

describe('Some test', function() {
  it('Some test', function() {
    // Some test code goes here.
  });
});

```
<!--FIXTURES_CONTENT_END-->