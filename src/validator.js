import Joi from 'joi';

function validate(payload, schema) {

  schema = schema || Joi.any();

  return new Promise((resolve, reject) => {

    Joi.validate(payload, schema, (error, value) => {

      if (error) {

        return reject({
          errorSource : `Invalid payload for schema`,
          error : error,
        });

      }

      return resolve(value);

    });

  });

}

export default validate;
