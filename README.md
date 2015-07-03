# Wrapper Generator

API Wrapper Generator

# NOTE

Very rought state.
Only tested with JSON API with non-parameter URLs.

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
      handler : function(response) {
        return response;
      },
    },
  },
  children : {
    foo : {
      // '/foo'
      handlers : {
        GET : {
          validate : {},
          handler : function(response) {
            return response;
          },
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
