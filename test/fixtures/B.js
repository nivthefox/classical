var A = require('./A');
var B = Extend(A, function() {
	this.constructor = Public(function() {
		process.emit('B.constructor', true);
	});

	this.three = Private(function() {
		process.emit('B.three', true);
	});

	this.five = Public(function() {
		this._super.three();
	});
});

module.exports = B;