# Classical
A simple cross-platform functional provider of classical inheritance for Javascript.

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
