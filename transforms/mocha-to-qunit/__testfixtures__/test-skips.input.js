import { describe, it, context } from 'mocha';

describe('Integration | Component', function() {

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

    // Should only skip the tests within the context.
    it('Defination of the skipped test', function() {
      // ...
    });

    // Should only skip the tests within the context.
    it('Defination of the skipped test', function() {
      // ...
    });
  });
});
