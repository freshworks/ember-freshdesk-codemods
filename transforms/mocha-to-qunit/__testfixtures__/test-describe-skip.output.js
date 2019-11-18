import { module, skip } from 'qunit';

// All the tests need to be skipped
module('Integration | Component', function() {

  skip('Defination of the test', function() {
    // ...
  });

  skip('Defination of the test', function() {
    // ...
  });

  module('Context test turns to module', function() {
    // ...

    skip('Defination of the test', function() {
      // ...
    });
  });

  module('Context test turns to module', function() {

    skip('Defination of the skipped test', function() {
      // ...
    });
  });
});
