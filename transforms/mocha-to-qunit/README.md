# mocha-to-qunit


## Usage

```
npx ember-freshdesk-codemods mocha-to-qunit path/of/files/ or/some**/*glob.js

# or

yarn global add ember-freshdesk-codemods
ember-freshdesk-codemods mocha-to-qunit path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/mocha-to-qunit/__testfixtures__/basic.input.js)</small>):
```js
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { find, findAll } from '@ember/test-helpers';
import { setupRenderingWithMirage, setupWindowMock } from '@freshdesk/test-helpers';

describe('Integration | Component', function() {
  let hooks = setupRenderingWithMirage();
  setupWindowMock(hooks);

  it('basic expect statements', async function() {
    // Simple true validation
    expect(true).to.be.true;
    expect(true, 'expect with message').to.be.true;

    // Simple false validation
    expect(false).to.be.false;
    expect(false, 'expect with message').to.be.false;

    // Negative cases with variance
    expect(result).to.be.empty;
    expect(result, 'With Message').to.be.empty;

    // Variations in equal assertion
    expect(true).to.equal(true);
    expect(find('[data-test-id=page-title]').innerText.trim(), '[Message] Expression with message').to.equal('[Expected] Page Title');

    // Variations in length
    // Find out if its a dom present case or not present case
    expect(findAll('[data-test-id=page-title]'), '[Message] Multiple elements should be present').to.have.length(2);
    expect(findAll('[data-test-id=page-title]')).to.have.length(1);
    expect(findAll('[data-test-id=page-title]'), '[Message] One Element Present').to.have.length(1); // With message and length 1
    expect(findAll('[data-test-id=page-title]'), '[Message] Element not present').to.have.length(0);
    expect(findAll('[data-test-id=page-title]')).to.have.length(0); // Without message
  });

  it('basic negative expect statements', function() {
    expect(false).to.not.be.true;
    expect(false, 'Message').to.not.be.true;
    expect(true).to.not.be.false;
    expect(true, 'Message').to.not.be.false;
  });

  it('Expect within a nested block', function() {
    // Comment
    [true, true].forEach((key) => {
      // Inner Comment
      expect(item).to.be.true;
    });

    [true, true].forEach(function(item) {
      // Inner Comment
      expect(item).to.be.true;
    });

  });

});

```

**Output** (<small>[basic.output.js](transforms/mocha-to-qunit/__testfixtures__/basic.output.js)</small>):
```js
import { module, test } from 'qunit';
import { find } from '@ember/test-helpers';
import {
  setupRenderingForModule,
  setupWindowMock
} from '@freshdesk/test-helpers';

module('Integration | Component', function() {
  let hooks = setupRenderingForModule();
  setupWindowMock(hooks);

  test('basic expect statements', async function(assert) {
    // Simple true validation
    assert.equal(true, true);
    assert.equal(true, true, 'expect with message');

    // Simple false validation
    assert.equal(false, false);
    assert.equal(false, false, 'expect with message');

    // Negative cases with variance
    assert.notOk(result);
    assert.notOk(result, 'With Message');

    // Variations in equal assertion
    assert.equal(true, true);
    assert.equal(find('[data-test-id=page-title]').innerText.trim(), '[Expected] Page Title', '[Message] Expression with message');

    // Variations in length
    // Find out if its a dom present case or not present case
    assert.dom('[data-test-id=page-title]').exists({ count: 2 }, '[Message] Multiple elements should be present');
    assert.dom('[data-test-id=page-title]').exists();
    assert.dom('[data-test-id=page-title]').exists({ count: 1 }, '[Message] One Element Present'); // With message and length 1
    assert.dom('[data-test-id=page-title]').doesNotExist('[Message] Element not present');
    assert.dom('[data-test-id=page-title]').doesNotExist(); // Without message
  });

  test('basic negative expect statements', function(assert) {
    assert.notEqual(false, true);
    assert.notEqual(false, true, 'Message');
    assert.notEqual(true, false);
    assert.notEqual(true, false, 'Message');
  });

  test('Expect within a nested block', function(assert) {
    // Comment
    [true, true].forEach((key) => {
      // Inner Comment
      assert.equal(item, true);
    });

    [true, true].forEach(function(item) {
      // Inner Comment
      assert.equal(item, true);
    });

  });

});

```
<!--FIXTURES_CONTENT_END-->