"use strict";

var _wrapperGenerator = require("./wrapper-generator");

var generateWrapper = _wrapperGenerator.generateWrapper;
var InvalidSpecError = _wrapperGenerator.InvalidSpecError;
module.exports = {
  wrap: generateWrapper,
  InvalidSpecError: InvalidSpecError };