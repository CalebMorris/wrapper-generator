"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _ = _interopRequire(require("lodash"));

var Promise = _interopRequire(require("bluebird"));

var request = _interopRequire(require("request"));

var validate = require("./validator").validate;

/**
* @param {String} options
* @param {String} path
* @param {Joi} validation
*/
function requester(options, path, validation) {
  return function (payload) {

    return Promise.resolve(payload).then(validate).then(function (validatedPayload) {

      return new Promise(function (resolve, reject) {

        var requestOptions = _.defaults(options, {
          url: path,
          json: validatedPayload,
          method: "GET",
          headers: {
            "content-type": "application/json",
            "User-Agent": "wrapper-generator/request" } });

        var callback = function (error, response, body) {
          if (error) {
            throw error;
          }

          if (response.statusCode !== 200) {
            return reject({
              statusCode: response.statusCode,
              body: body });
          }

          if (body && body.response && body.response.error) {
            return reject({
              failureCode: body.response.error.code,
              body: body });
          }

          return resolve({ body: body });
        };

        request(requestOptions, callback);
      });
    });
  };
}

module.exports = requester;