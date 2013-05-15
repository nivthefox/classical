var Assert          = require('assert');
var Classical       = require('../index');


suite('Interface');

test('Interface inheritance', function () {
    var Foo = Interface(function() {this.name = 'foo';});
    var Bar = Implement(Foo, function() {this.name = 'bar';});
    var baz = new Bar;

    Assert.ok(baz instanceof Foo);
    Assert.ok(baz instanceof Bar);
});

test('Advanced interface inheritance', function () {
    var Foo = Interface(function() {this.name = 'foo'});
    var Bar = Interface(function() {this.name = 'bar'});
    var Baz = Implement([Foo, Bar], function() { this.name = 'baz'});
    var baz = new Baz;

    Assert.ok(baz instanceof Baz, 'Baz');
    Assert.ok(baz instanceof Foo, 'Foo');
    Assert.ok(baz instanceof Bar, 'Bar');
});
