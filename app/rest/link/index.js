const _               = require('lodash');
const { getLogger }   = require('../../util');
const createUpdateAll = require('./create-update-all');
const delAll          = require('./del-all');
const delOne          = require('./del-one');
const retrieveAll     = require('./retrieve-all');
const retrieveOne     = require('./retrieve-one');
const sendData        = require('./send-data');
const sendError       = require('./send-error');
const updateOne       = require('./update-one');

const logger = getLogger();

/**
 * Sets up CRUD api for a sequelize model to the server.
 *
 * @memberof module:app/rest
 * @param {Object} server - The server instance.
 * @param {Object} model - The sequelize model.
 */
function link(server, model) {
  logger.debug(`link ${model.name}`);

  // Finally, wire things up.
  server.route(`/${model.name}`)
    .put(_.curry(createUpdateAll, 3)(model))
    .post(_.curry(retrieveAll, 3)(model))
    .delete(_.curry(delAll, 3)(model));

  server.route(`/${model.name}/:id`)
    .get(_.curry(retrieveOne, 3)(model))
    .put(function(req, res) {
      logger.debug('updateOneWrapper', req.body);
      return updateOne(model, req.body)
        .then(_.curry(sendData, 2)(res))
        .catch(_.curry(sendError, 2)(res));
    })
    .delete(_.curry(delOne, 3)(model));
}

module.exports = link;