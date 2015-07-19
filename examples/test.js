var wrap = require('../dist').wrap;
var Joi = require('joi');

var api = wrap('https://api.github.com/users/calebmorris/repos', {
  // '/'
  handlers : {
    GET : {
      validate : Joi.any(),
      handler : function(response) {
        return response;
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
