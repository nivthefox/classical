var expectedVersion                     = require('../package.json').version;
var componentVersion					= require('../component.json').version;

require('../index');
var scriptVersion						= process.versions.classical;

if (componentVersion !== expectedVersion) {
	console.error('Component.js has version %s, expected %s', componentVersion, expectedVersion);
	process.exit(1);
}

if (scriptVersion !== expectedVersion) {
	console.error('Component.js has version %s, expected %s', componentVersion, expectedVersion);
	process.exit(1);
}

console.log('All versions up to date.');
process.exit(0);