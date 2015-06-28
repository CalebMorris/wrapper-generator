import _ from 'lodash';
import Promise from 'bluebird';

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
 * @param {Object<Func>} chlidren - List of children functions to be generated as
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
    let result = null;

    function baseResult(...baseResultArgs) {
      if (shouldContinue) {
        result = base(...baseResultArgs);
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

    _.each(children, (child, name) => {

      if (executionPromise.hasOwnProperty(name)) {
        throw new InvalidChildNameError(
          `Property already attached to execution '${name}'`
        );
      }

      executionPromise[name] = (...args) => {
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
