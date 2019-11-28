test('Method with return expression', function(assert) {
  expect(currentURL(), 'Url page', '/url/param');
});

// Input
// it('Method with return expression', function() {
//   expect(currentURL(), 'Url page', '/url/param');
//   expect(find(ref)[0]);
//   expect(find('#element'));
//   expect(findAll('.elements').length, 1);
//   expect('[data-test-id="selector"]'.length, 0);
//   expect(calledSpy.calledWith(ref));
// });

// Output
// test('Method with return expression', function(assert) {
//   assert.equal(currentURL(), '/url/param', 'Url page');
//   assert.ok(find(ref)[0]);
//   assert.ok(find('#element'));
//   assert.equal(findAll('.elements').length, 1);
//   assert.equal('[data-test-id="selector"]'.length, 0);
//   assert.ok(calledSpy.calledWith(ref));
// });
