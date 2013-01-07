var Assert 			= require('assert');
var Classical 		= require('../index');

suite('Classical');

test('Defined', function() {
	Assert.equal(typeof Classical, 'object');
	Assert.equal(typeof Class, 'function');
});
