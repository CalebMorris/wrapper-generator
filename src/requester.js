import _ from 'lodash';
import Promise from 'bluebird';
import request from 'request';

import { validate } from './validator';

/**
* @param {String} options
* @param {String} path
* @param {Joi} validation
*/
function requester(options, path, validation) {
  return (payload) => {

    return Promise.resolve(payload)
      .then(validate)
      .then((validatedPayload) => {

        return new Promise((resolve, reject) => {

          const requestOptions = _.defaults(options, {
            url : path,
            json : validatedPayload,
            method : 'GET',
            headers : {
              'content-type' : 'application/json',
              'User-Agent' : 'wrapper-generator/request',
            },
          });

          const callback = (error, response, body) => {
            if (error) {
              throw error;
            }

            if (response.statusCode !== 200) {
              return reject({
                statusCode : response.statusCode,
                body : body,
              });
            }

            if (body && body.response && body.response.error) {
              return reject({
                failureCode : body.response.error.code,
                body : body,
              });
            }

            return resolve({ body : body });
          };

          request(requestOptions, callback);

        });

      });
  };
}

export default requester;
