import { describe, it, context } from 'mocha';

// All the tests need to be skipped
describe.skip('Integration | Component', function() {

  it('Defination of the test', function() {
    // ...
  });

  it.skip('Defination of the test', function() {
    // ...
  });

  context('Context test turns to module', function() {
    // ...

    it('Defination of the test', function() {
      // ...
    });
  });

  context.skip('Context test turns to module', function() {

    it('Defination of the skipped test', function() {
      // ...
    });
  });
});
