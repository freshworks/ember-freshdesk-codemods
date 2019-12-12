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
