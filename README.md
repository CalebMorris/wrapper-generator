# Wrapper Generator

API Wrapper Generator

# NOTE

Not currently working

# Example - Wrap API

Multiple methods

```javacript

var wrap = require('wrapper-generator').wrap;
var Joi = require('joi');

var api = wrap('https://api.github.com/users/mralexgray/repos', {
  // '/'
  handlers : {
    GET : {
      validate : Joi.any(),
      handler : function() {},
    },
  },
  children : {
    foo : {
      // '/foo'
      handlers : {
        GET : {
          validate : {},
          handler : function() {},
        },
      },
    },
  },
});

api({
    method : 'GET',
  })
  .then(function(response) {
    console.log('Success', response);
  })
  .catch(function(err) {
    console.error('!!Error: ', err);
  });

```
