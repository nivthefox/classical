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
var Dog = Mammal.extend(function() {
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
```PublicMember```

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
```ProtectedMember```

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
```PrivateMember```

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
console.log(n.bar()); // => 'foo'
```

## Extend
Extends an existing class

### Parameters
```fn```            The definition of the class, represented as a function.

### Returns
```Class```         A factory to create instances of the class (using the new keyword)

### Example
```javascript
var Baz = Foo.extend(function() {
    this.baz = Public(function() {
        return this.bar();
    });
});
var n   = new Baz;
console.log(n.baz()); // => 'foo'
```
