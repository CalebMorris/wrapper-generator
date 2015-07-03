"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _ = _interopRequire(require("lodash"));

var isUrl = _interopRequire(require("is-url"));

var chain = require("function-chainer").chain;

var requester = _interopRequire(require("./requester"));

/**
 * Error for when the spec is invalid
 */
function InvalidSpecError() {
  var message = arguments[0] === undefined ? "" : arguments[0];

  this.name = "InvalidSpecError";
  this.message = message;
}
InvalidSpecError.prototype = Error.prototype;

/**
 * @param {String} url - Base url for API
 * @param {Object<Object>} spec - Spec describing the structure of the API
 * @return {Function} Chained function
 */
function generateWrapper(url, spec) {

  if (!isUrl(url)) {
    throw new Error("URL not valid: " + url);
  }

  var handler = function (options, payload) {

    if (!options.method) {
      throw new InvalidSpecError("Missing method option for API path: " + url);
    }

    var childHandlerSpec = spec.handlers[options.method];
    var requestHandler = requester(options, url, childHandlerSpec.validate);

    return requestHandler(payload).then(childHandlerSpec.handler)["catch"](function (err) {
      throw err;
    });
  };

  var childHandlers = _.mapValues(spec.children, function (childSpec, key) {

    // Maps handler spec object to handler function
    return generateWrapper(url + "/" + key, childSpec);
  });

  return chain(handler, childHandlers);
}

module.exports = { generateWrapper: generateWrapper, InvalidSpecError: InvalidSpecError };