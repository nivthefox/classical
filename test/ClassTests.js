var Assert          = require('assert');
var Classical       = require('../index');

suite('Class');

var A;
var B;
var C;

afterEach(function() {
    process.removeAllListeners();
});

test('Initializing a class', function(done) {
    A                                   = require('./fixtures/A');

    process.on('A.constructor', function(val) {
        Assert.ok(val);
        done();
    });

    var a                               = new A;

    Assert.ok(a instanceof A);
});

test('Methods', function(done) {
    // Setup
    var tests = {
        constructor                     : false,
        one                             : false,
        two                             : false,
        three                           : false,
        four                            : false,
        fourAgain                       : false
    };

    process.on('ClassTest', function(called) {
        if (called === 'four' && tests['four'] === true) {
            called                      = 'fourAgain';
        }

        tests[called]                   = true;

        try {
            Assert.deepEqual(tests, {
                constructor             : true,
                one                     : true,
                two                     : true,
                three                   : true,
                four                    : true,
                fourAgain               : true
            });
            done();
        }
        catch (e) {}
    });

    process.on('A.constructor', function(val) {
        Assert.ok(val);
        process.emit('ClassTest', 'constructor');
    });

    process.on('A.one', function(val) {
        Assert.ok(val);
        process.emit('ClassTest', 'one');
    });

    process.on('A.two', function(val) {
        Assert.ok(val);
        process.emit('ClassTest', 'two');
    });

    process.on('A.three', function(val) {
        Assert.ok(val);
        process.emit('ClassTest', 'three');
    });

    process.on('A.four', function(val) {
        Assert.ok(val);
        process.emit('ClassTest', 'four');
    });

    // Execute
    var a                               = new A;

    Assert.equal(typeof a.one, 'function');
    Assert.notEqual(typeof a.two, 'function');
    Assert.notEqual(typeof a.three, 'function');
    Assert.equal(typeof A.four, 'function');
    Assert.equal(typeof a.four, 'function');

    a.one();
    a.four();
    A.four();
});

test('Extending Classes', function(done) {
    // Setup
    B                                   = require('./fixtures/B');

    var tests = {
        a : {
            constructor                 : false,
            one                         : false,
            two                         : false,
            three                       : false,
            four                        : false
        },
        b : {
             constructor                : false,
             three                      : false,
             five                       : false
        }
    };

    process.on('ClassTest', function(cl, called) {
        tests[cl][called]               = true;

        try {
            Assert.deepEqual(tests, {
                a : {
                    constructor                 : true,
                    one                         : true,
                    two                         : true,
                    three                       : false,
                    four                        : true
                },
                b : {
                     constructor                : true,
                     three                      : true,
                     five                       : false
                }
            });
            done();
        }
        catch (e) {}
    });

    process.on('A.constructor', function(val) {
        Assert.ok(val);
        process.emit('ClassTest', 'a', 'constructor');
    });

    process.on('A.one', function(val) {
        Assert.ok(val);
        process.emit('ClassTest', 'a', 'one');
    });

    process.on('A.two', function(val) {
        Assert.ok(val);
        process.emit('ClassTest', 'a', 'two');
    });

    process.on('A.three', function(val) {
        Assert.ok(val);
        process.emit('ClassTest', 'a', 'three');
    });

    process.on('A.four', function(val) {
        Assert.ok(val);
        process.emit('ClassTest', 'a', 'four');
    });

    process.on('B.constructor', function(val) {
        Assert.ok(val);
        process.emit('ClassTest', 'b', 'constructor');
    });

    process.on('B.three', function(val) {
        Assert.ok(val);
        process.emit('ClassTest', 'b', 'three');
    });

    process.on('B.five', function(val) {
        Assert.ok(val);
        process.emit('ClassTest', 'b', 'five');
    });

    // Execute
    var b                               = new B;

    Assert.equal(typeof b.one, 'function');
    Assert.notEqual(typeof b.two, 'function');
    Assert.notEqual(typeof b.three, 'function');
    Assert.equal(typeof B.four, 'function');
    Assert.equal(typeof b.four, 'function');
    Assert.equal(typeof b.five, 'function');

    b.one();
    b.four();
    // b.five();

    Assert.ok(b instanceof B);
    Assert.ok(b instanceof A);
});

test('Extending Objects', function(done) {
    // Setup
    C                                   = require('./fixtures/C');

    var tests = {
        one                             : false,
        two                             : false,
        C                               : false
    }
    
    process.on('ClassTest', function(called) {
        tests[called]                   = true;

        try {
            Assert.deepEqual(tests, {
                one                     : true,
                two                     : true,
                C                       : true
            });
            done();
        }
        catch(e) {};
    });

    process.on('test.one', function(val) { 
        Assert.ok(val);
        process.emit('ClassTest', 'one');
    });


    process.on('test.two', function(val) { 
        Assert.ok(val);
        process.emit('ClassTest', 'two');
    });

    process.on('C.one', function(val) {
        Assert.ok(val);
        process.emit('ClassTest', 'C');
    });

    // Execute
    var c                               = new C;
    c.one();
    c.two();
});

test('Accessing the public API', function() {
    var a                               = new A;
    Assert.deepEqual(a, a.getPublicApi());
});