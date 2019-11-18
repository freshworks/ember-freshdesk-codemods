import { module, test, skip } from 'qunit';

module('Integration | Component', function() {

  test('Defination of the test', function() {
    // ...
  });

  skip('Defination of the test', function() {
    // ...
  });

  module('Context test turns to module', function() {
    // ...

    test('Defination of the test', function() {
      // ...
    });
  });

  module('Context test turns to module', function() {

    // Should only skip the tests within the context.
    skip('Defination of the skipped test', function() {
      // ...
    });

    // Should only skip the tests within the context.
    skip('Defination of the skipped test', function() {
      // ...
    });
  });
});
