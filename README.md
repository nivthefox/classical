# Classical
A simple cross-platform functional provider of classical inheritance for Javascript.

# Documentation
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
        this._super('Woof!');
    });
});
```

## Instantiation
```javascript
var Spot = new Dog('Spot', 'Dalmation');
Spot.speak(); // Outputs: 'Spot says, "Woof!"' to the console.
```