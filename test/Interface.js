var Assert                              = require('assert');
var Classical                           = require('../');

suite('Interface');

var IFace;
var EIFace;
var Impl;

test('Create Interface', function() {
    IFace = Interface(function() {
        this.foo = Public(function(bar) {});
        this.bar = Protected(Classical.INT);
    });

    Assert.ok(IFace.name == 'Interface');
    try {
        var n = new IFace;
    }
    catch(e) {
        Assert.ok(e.message == 'Cannot instantiate interface.');
    }
});

test('Extend Interface', function() {
    EIFace = Extend(IFace, function() {
        this.bar = Protected(Classical.FLOAT);
        this.baz = Static(Public(Classical.INT));
    });

    Assert.ok(EIFace.name == 'Interface');
});

test('Implement Interface', function() {
    var badimplran = false;
    try {
        var BadImpl = Implement(EIFace, function() {
            this.foo = Public(function(bar) {});
            this.bar = Protected("1234");
        });
    }
    catch (e) {
        Assert.ok(e instanceof TypeError);
        badimplran = true;
    }
    finally {
        if (!badimplran) {
            Assert.ok(false, 'Did not throw TypeError as expected.');
        }
    }

    badimplran = false;
    try {
        BadImpl = Implement(EIFace, function() {
            this.foo = Public(function() {});
            this.bar = Protected(1234);
        });
    }
    catch (e) {
        Assert.ok(e instanceof TypeError);
        badimplran = true;
    }
    finally {
        if (!badimplran) {
            Assert.ok(false, 'Did not throw TypeError as expected.');
        }
    }

    // TODO: Visibility tests
    // TODO: Static tests

    Impl = Implement(EIFace, function() {
        this.foo = Public(function(bar) {});
        this.bar = Protected(1234);
    });

    Assert.ok(Impl.name == 'Class');
});