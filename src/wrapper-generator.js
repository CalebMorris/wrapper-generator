import _ from 'lodash';
import isUrl from 'is-url';

import { chain } from 'function-chainer';
import requester from './requester';

/**
 * Error for when the spec is invalid
 */
function InvalidSpecError(message = '') {
  this.name = 'InvalidSpecError';
  this.message = message;
}
InvalidSpecError.prototype = Error.prototype;

/**
 * @param {String} url - Base url for API
 * @param {Object<Object>} spec - Spec describing the structure of the API
 * @return {Function} Chained function
 */
function generateWrapper(url, spec) {

  if (! isUrl(url)) {
    throw new Error('URL not valid: ' + url);
  }

  const handler = (options, payload) => {

    if (! options.method) {
      throw new InvalidSpecError('Missing method option for API path: ' + url);
    }

    const childHandlerSpec = spec.handlers[options.method];
    const requestHandler = requester(options, url, childHandlerSpec.validate);

    return requestHandler(payload)
      .then(childHandlerSpec.handler)
      .catch((err) => {
        throw err;
      });

  };

  const childHandlers = _.mapValues(spec.children, (childSpec, key) => {

    // Maps handler spec object to handler function
    return generateWrapper(url + '/' + key, childSpec);

  });

  return chain(handler, childHandlers);

}

export default { generateWrapper, InvalidSpecError };
