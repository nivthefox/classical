# Classical
A simple cross-platform JavaScript Class provider for a classical interface to prototypal inheritance.

# Documentation
## Creating a Class
```javascript
var Mammal = require('classical').create(function() {
    this.name                           = null;

    this.constructor = function(name) {
        this.name                       = name;
    };

    this.speak = function(text) {
        console.log('%s says, "%s"', this.name, text);
    };
});
```

## Extension
```javascript
var Dog = Mammal.extend(function() {
    this.breed                          = null;

    this.constructor = function(name, breed) {
        this.breed                      = breed;
    };

    this.speak = function() {
        this.super.speak('Woof!');
    }
});
```

## Instantiation
```javascript
var Spot = new Dog('Spot', 'Dalmation');
Spot.speak(); // Outputs: 'Spot says, "Woof!"' to the console.
```

## Interfaces
```javascript
var Animal = require('classical').interface(function() {
    this.speak                          = function() {};
});
Mammal.implements(Animal);
```
