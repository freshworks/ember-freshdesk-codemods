import { expect } from 'chai';
import { describe, it, context } from 'mocha';
import { find, findAll } from '@ember/test-helpers';
import { setupTest, setupWindowMock, setupApplicationTest } from '@freshdesk/test-helpers';

describe('Integration | Component', function() {
  let hooks = setupApplicationTest();
  setupTest();
  setupWindowMock(hooks);

  it('basic expect statements', async function() {
    // Simple true validation
    expect(true).to.be.true;
    expect(true, 'expect with message').to.be.true;
    expect('Test').to.be.ok;
    expect('Test', 'With message').to.be.ok;
    expect('Test').to.be.present;
    expect('Test', 'With message').to.be.present;

    // Simple false validation
    expect(false).to.be.false;
    expect(false, 'expect with message').to.be.false;

    // Negative cases with variance
    expect(result).to.be.empty;
    expect(result, 'With Message').to.be.empty;
    expect(undefined).to.be.undefined;

    // Variations in equal assertion
    expect(true).to.equal(true);
    expect(find('[data-test-id=page-title]').innerText.trim(), '[Message] Expression with message').to.equal('[Expected] Page Title');
    expect(window.location.pathname).to.be.equal('/support/login');

    // Variations in length
    // Find out if its a dom present case or not present case
    expect(findAll('[data-test-id=page-title]'), '[Message] Multiple elements should be present').to.have.length(2);
    expect(findAll('[data-test-id=page-title]')).to.have.length(1);
    expect(findAll('[data-test-id=page-title]'), '[Message] One Element Present').to.have.length(1); // With message and length 1
    expect(findAll('[data-test-id=page-title]'), '[Message] Element not present').to.have.length(0);
    expect(findAll('[data-test-id=page-title]')).to.have.length(0); // Without message
    // Should handle this edge cases
    // expect(find('[data-test-id=page-titles]').querySelectorAll('[data-test-id=page-title]')).to.have.length(2);
    // expect(find('[data-test-id=page-titles]').querySelector('[data-test-id=page-title]')).to.have.length(1);

    // Variations in dom assertions
    expect(find('[data-test-id=page-title]')).to.be.ok;
    expect(findAll('[data-test-id=page-title]')).to.be.empty;
  });

  // 'expected-contains'
  it('Contains expects expected-contains', function() {
    expect('Message has input').to.be.contains('input');
    expect([1, 2]).to.be.contain(2);
    expect('Message has input', 'Assertions Message').to.have.contain('input');
    expect('Message has input').to.be.contain('input');
    expect('Message has input').to.contains('input');

    expect('Message has input').to.be.include('input');
    expect('Message has input').to.includes('input');
    expect([1, 2]).to.be.include(2);
    expect([1, 2]).to.be.includes(2);
    expect('Message has input').to.have.string('input');
    // Should handle this edge cases
    // expect(options).to.be.an('array').to.not.include(serviceTaskType);

    // Not contains
    expect('Message').to.not.contain('input');
    expect('Message', 'Assertions Message').to.not.contains('input');
    expect('Message').to.not.include('input');
    expect('Message', 'Assertions Message').to.not.includes('input');
    expect('Message').to.not.have.string('input');
  });

  // 'expected-null'
  it('Contains expects expected-null', function() {
    expect('Has Value', 'message').to.not.be.null;
    expect(['Has Value'], 'message').to.be.null;

    // or assert.dom('selector').doesNotExist(message);
    expect(find('dom-selector'), 'message').to.not.be.null;
    expect(find('dom-selector'), 'message').to.be.null;
  });

  // 'expected-exists'
  it('Contains expects expected-exists', function() {
    let refrence = 'Some Value';
    expect('Value').to.exist;
    expect(['Has Value'], 'message').to.exist;
    expect(refrence, 'message').to.exist;
    expect(refrence, 'message').not.to.exist;

    // or assert.dom('selector').doesNotExist(message);
    expect(find('dom-selector')).to.exist;
    // Should handle this edge cases
    // expect(find('[data-test-id=page-titles]').querySelector('[data-test-id=page-title]')).to.exist;
    expect(find('dom-selector'), 'message').to.exist;
    expect(find('dom-selector'), 'message').to.not.exist;
  });
});
