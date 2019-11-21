import { describe } from 'mocha';

describe('Integration | Component | app-components/from-email', function() {
  
  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
    this.get('store').createRecord('contact', contact);
  });

});
