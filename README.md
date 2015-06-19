# Wrapper Generator

API Wrapper Generator and Function Chaining Generator

# NOTE

Currently only a function chainer and doesn't wrap a full API yet

# Example

```javascript

var generate = require('wrapper-generator').generate;

function base() {
  console.log('BASE');
}

function child() {
  console.log('CHILD');
}

var base = generate(base, [child]);

base(); // Prints BASE
base().child(); // Prints CHILD


```
