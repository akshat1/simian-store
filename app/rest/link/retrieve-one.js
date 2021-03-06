const _         = require('lodash');
const { getLogger } = require('../../util');
const sendData  = require('./send-data');
const sendError = require('./send-error');

const logger = getLogger();

module.exports = function retrieveOne(model, req, res) {
  const { id } = req.params;
  logger.debug(`retrieveOne(${id})`);
  return model
    .findById(id)
    .then(_.curry(sendData, 2)(res))
    .catch(_.curry(sendError, 2)(res));
}
