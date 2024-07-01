# modify-import


## Usage

```
npx @freshworks/ember-codemods modify-import path/of/files/ or/some**/*glob.js

# or

yarn global add @freshworks/ember-codemods
@freshworks/ember-codemods modify-import path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic-imports](#basic-imports)
* [existing-import](#existing-import)
* [integration-helpers](#integration-helpers)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic-imports">**basic-imports**</a>

**Input** (<small>[basic-imports.input.js](transforms/modify-import/__testfixtures__/basic-imports.input.js)</small>):
```js
import { describe, it } from 'mocha';
import setupAcceptance from 'freshdesk/tests/helpers/setup-acceptance';
import {
  addFeatures,
  addLaunched,
  addAbilities,
  removeFeatures,
  removeAbilities,
  convertMirageToModel,
  spyFlashMessage
} from 'freshdesk/tests/helpers/util-test-helpers';

describe('Some test', function() {
  it('Some test', function() {
    // Some test code goes here.
  });
});

```

**Output** (<small>[basic-imports.output.js](transforms/modify-import/__testfixtures__/basic-imports.output.js)</small>):
```js
import { describe, it } from 'mocha';

import {
  addAbilities,
  addFeatures,
  addLaunched,
  convertMirageToModel,
  removeAbilities,
  removeFeatures,
  spyFlashMessage,
  setupAcceptance,
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
import { addAbilities, addFeatures } from 'freshdesk/tests/helpers/util-test-helpers';
import { spyFlashMessage } from '@freshdesk/test-helpers';

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
  spyFlashMessage,
  addAbilities,
  addFeatures
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
  setupCurrentAccount,
  setupCurrentUser
} from '@freshdesk/test-helpers';

describe('Some test', function() {
  it('Some test', function() {
    // Some test code goes here.
  });
});

```
<!--FIXTURES_CONTENT_END-->
