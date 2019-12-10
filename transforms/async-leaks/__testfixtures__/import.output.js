import { describe } from 'mocha';

import { run } from '@ember/runloop';

describe('Integration | Component | app-components/from-email', function() {
  
  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
    run(async () => {
      this.get('store').createRecord('contact', contact);
    });
  });

});
