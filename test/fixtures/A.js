var A = Class(function() {
	this.constructor = Public(function() {
		process.emit('A.constructor', true);
	});

	this.one = Public(function() {
		process.emit('A.one', true);
		this.two();
		this.three();
	});

	this.two = Protected(function() {
		process.emit('A.two', true);
	});

	this.three = Private(function() {
		process.emit('A.three', true);
	});

	this.four = Static(Public(function() {
		process.emit('A.four', true);
	}));
});

module.exports = A;