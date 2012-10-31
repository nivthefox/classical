Classical
##################
A simple cross-platform functional provider of classical inheritance for Javascript.

# Including in your code
## node.js
```javascript
require('classical')
```

Classical methods (Class, Extend, Public, etc.) will be placed in the global scope and can be used anywhere in your code.

If you would prefer not to use Classical at the global level, you will need to set ```process.env.CLASSICAL_PROTECTGLOBALS```
to ```true```, and then require classical in each class:

```javascript
var Classical = require('classical')
```

You can then use the classical variables as ```Classical.Class```, ```Classical.Extend```, ```Classical.Public```, etc.

## browser (unminified, global scope)
In the browser, Classical requires [require.js](http://requirejs.org/).

You must configure your requirejs to know where Classical's methods are located:

```javascript
requirejs.config({
    paths : {
        Classical           : '/path/to/classical/index',
        Class               : '/path/to/classical/src/Class',
        Interface           : '/path/to/classical/src/Interface'
    },
    deps: ['Classical', 'Class', 'Interface']
});
```

You can then use Classical as a normal requirement:

```javascript
define(function() {
    return Class(function() {});
});
```

## browser (unminified, local scope)
If you would prefer Classical not put itself at the window level, you will need to set ```window.CLASSICAL_PROTECTGLOBALS```
to ```true``` before requiring Classical.

You must still configure Classical the same way; however, there are some differences when using Classical later:

```javascript
define(['Classical'], function(Classical) {
    return Classical.Class(function() {});
});
```

## browser (minified, global scope)
If you would like to use the minifed version of Classical, you must use a different requirejs config:

```javascript
requirejs.config({
    paths : {
        Classical           : '/path/to/classical/index.min.js'
    },
    deps: ['Classical']
}
```

## browser (minified, local scope)
You can also use the minified version of Classical without affecting the window.  This is done the same way as before,
using the configuration for the minfied version.

# Examples
## Creating a Class
```javascript
require('classical');

var Mammal = Class(function() {
    this.name                           = Protected(null);

    this.constructor = Public(function(name) {
        this.name                       = name;
    });

    this.speak = Public(function(text) {
        console.log('%s says, "%s"', this.name, text);
    });
});
```

## Extension
```javascript
var Dog = Extend(Mammal, function() {
    this.breed                          = Protected(null);

    this.constructor = Public(function(name, breed) {
        this.breed                      = breed;
    });

    this.speak = Public(function() {
        this._super.speak('Woof!');
    });
});
```

## Instantiation
```javascript
var Spot = new Dog('Spot', 'Dalmation');
Spot.speak(); // Outputs: 'Spot says, "Woof!"' to the console.
```

# API
## Public
Defines a public member for a class.

### Parameters
```member```        The definition of the member.  This member will be publically available 
                    for all instances of the class and its children.

### Returns
```PublicMember```  A public member 

### Example
```javascript
this.foo = Public(function() {
    return 'foo';
});
```

## Protected
Defines a protected member for a class.

### Parameters
```member```        The definition of the member.  This member will be privately available for
                    all instances of the class and its children.

### Returns
```ProtectedMember```   A protected member

### Example
```javascript
this.foo = Protected(function() {
    return 'foo';
});
```

## Private
Defines a private member for a class.

### Parameters
```member```        The definition of the member.  This member will be privately available for
                    all instances of the class, but will be unavailable to its children.

### Returns
```PrivateMember``` A private member

### Example
```javascript
this.foo = Private(function() {
    return 'foo';
});
```

## Class
Defines a new Class.

### Parameters
```fn```            The definition of the class, represented as a function.

### Returns
```Class```         A factory to create instances of the class (using the new keyword)

### Example
```javascript
var Foo = Class(function() {
    this.foo = Protected(function() {
        return 'foo';
    });
    
    this.bar = Public(function() {
        return this.foo();
    });
});
var n   = new Foo;
console.log(n.foo()); // => 'foo'
```
## Extend
Extends an existing Classical or non-Classical class.

### Parameters
```ancestor```      The non-Classical class to inherit from.
```fn```            The definition of the class, represented as a function.

### Example
```javascript
var Baz = Inherit(require('event').EventEmitter, function() {
    this.constructor = Public(function() {
        this.on('baz', this.qux);
    });

    this.baz = Public(function() {
        this.emit('baz');
    });

    this.qux = Private(function() {
        console.log('foo');
    });
});
var n   = new Baz;
n.baz(); // => 'foo'
```

## Interface
Creates a new interface to be implemented.

### Parameters
```fn```            The definition of the interface, represented as a function.

### Example
```javascript
var Squee = Interface(function() {
    this.moog = Public(function(ap) {}); // A public method with one argument.
    this.dar = Protected(Class.BOOLEAN); // A protected boolean
    this.han = Public(Class.INT); // A public integer
    this.mik = Private(Class.STRING); // A private string
});
```

## Implement
Implements interfaces as a classical class.

### Parameters
```interfaces```    An interface (or several interfaces as an array).
```fn```            The definition of the implementing class, represented as a function.

### Example
```javascript
var Nop = Implement(Squee, function() {
    this.moog = Public(function(ap) {
        return Util.format(this.mik, ap, this.han, ap + this.han);
    });

    this.dar = Protected(true);
    this.han = Public(4);
    this.mik = Private("%s + %s = %s");
});
```
