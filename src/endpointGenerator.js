import _ from 'lodash';

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

  const wrappedFunc = () => {
    let shouldContinue = true;
    let executionPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(shouldContinue);
      }, 0);
    });

    _.each(children, (child) => {
      const funcName = stripFunctionName(child);

      if (executionPromise.hasOwnProperty(funcName)) {
        throw new InvalidChildNameError(
          `Property already attached to execution '${funcName}'`
        );
      }

      executionPromise[funcName] = () => {
        shouldContinue = false;
        child(arguments);
      };
    });

    executionPromise.then((shouldContinue) => {
      if (shouldContinue) {
        base();
      }
    });

    return executionPromise;
  };

  return wrappedFunc;

}

export default { generate, InvalidChildNameError };
