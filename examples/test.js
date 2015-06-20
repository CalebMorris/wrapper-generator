var Promise = require('bluebird');

var generate = require('../dist/endpointGenerator').generate;

function base() {
  console.log('BASE');
}

function child() {
  console.log('CHILD');
}

var base = generate(base, [child]);

base(); // Prints BASE
base().child(); // Prints CHILD
