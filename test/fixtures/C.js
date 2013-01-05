var test = {
	one : function() { process.emit('test.one', true); },
	two : function() { process.emit('test.two', true); }
};

var C = Extend(test, function() {
	this.one = Public(function() {
		process.emit('C.one', true);

		this._super.one();
	});
});

module.exports 							= C;