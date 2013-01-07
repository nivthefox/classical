var expectedVersion                     = require('../package.json').version;
var componentVersion					= require('../component.json').version;

require('../index');
var scriptVersion						= process.versions.classical;

if (componentVersion !== expectedVersion) {
	console.error('component.json has version %s, expected %s', componentVersion, expectedVersion);
	process.exit(1);
}

if (scriptVersion !== expectedVersion) {
	console.error('index.js has version %s, expected %s', scriptVersion, expectedVersion);
	process.exit(1);
}

console.log('All versions are %s', expectedVersion);
process.exit(0);