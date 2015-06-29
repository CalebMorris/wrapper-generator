# Wrapper Generator

API Wrapper Generator

# NOTE

Not currently working

# Example - Wrap API

Multiple methods

```javacript

var wrap = require('wrapper-generator').wrap;

var wrappedAPI = wrap({
  // '/'
  handles : {
    POST : {
      validate : {},
      handler : function() {},
    },
  },
  children : {

  }
});

```
