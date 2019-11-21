import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupRenderingTest } from 'ember-mocha';
import { render, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import contact from 'freshdesk/tests/fixtures/contact';
import { run } from "@ember/runloop";

describe('Integration | Component | app-components/widgets/email-info', function() {

  let hooks = setupRenderingTest();

  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
    run(() => {
      this.get('store').pushPayload('contact', contact);
    });
    run(() => {
      this.set('contact', this.get('store').peekRecord('contact', 1));
    });
  });

  it('verify all emails are rendered in contact info items', async function() {
    await render(hbs`{{app-components/widgets/email-info model=contact}}`);
    expect(findAll('[data-test-email]')).to.have.length(this.get('contact').get('allEmails').length);
    expect(findAll('[data-test-emails-title]')).to.have.length(1);
  });

});
