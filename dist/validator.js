"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Joi = _interopRequire(require("joi"));

function validate(payload, schema) {

  schema = schema || Joi.any();

  return new Promise(function (resolve, reject) {

    Joi.validate(payload, schema, function (error, value) {

      if (error) {

        return reject({
          errorSource: "Invalid payload for schema",
          error: error });
      }

      return resolve(value);
    });
  });
}

module.exports = validate;