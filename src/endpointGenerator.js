import _ from 'lodash';
import Promise from 'bluebird';

import { stripFunctionName } from './util';

/*
 * Error for possibly common throw cases
 *   - Any function names are defined Promise attributes
 *   - Are duplicates
 */
function InvalidChildNameError(message = '') {
  this.name = 'InvalidChildNameError';
  this.message = message;
}
InvalidChildNameError.prototype = Error.prototype;


/*
 * Generates the necessary chaining wrappers for a function and children
 * @param {Func} base - function that others may be called from in the form
 *  `base().child()`
 * @param {Array<Func>} chlidren - List of children functions to be generated as
 * well
 * @throws InvalidChildNameError
 * @returns {Func} - Chained function
 */
function generate(base, children) {

  children = children || [];

  const wrappedFunc = (...args) => {
    const baseArguments = args;

    let isLoaded = false;
    let shouldContinue = true;
    let result = -333;

    function baseResult(...args) {
      if (shouldContinue) {
        result = base(...args);
      }
      return result;
    }

    let executionPromise = new Promise((resolve) => {
      function checkLoaded() {
        if (isLoaded) {
          return resolve(baseResult(...baseArguments));
        }
        setTimeout(checkLoaded, 0);
      }

      checkLoaded();
    });

    _.each(children, (child) => {
      const funcName = stripFunctionName(child);

      if (executionPromise.hasOwnProperty(funcName)) {
        throw new InvalidChildNameError(
          `Property already attached to execution '${funcName}'`
        );
      }

      executionPromise[funcName] = (...args) => {
        shouldContinue = false;
        result = child(...args);
        return Promise.resolve(result);
      };
    });


    isLoaded = true;

    return executionPromise;
  };

  return wrappedFunc;

}

export default { generate, InvalidChildNameError };
