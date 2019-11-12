const mongo = require('./mongo.config');
const serverConfigs = require('./server.config');
const environment = require('./environment.config');
const logger = require('./logger.config');

global.configuration = environment;

module.exports = {
  initialize: async () => {
	  const db = await mongo.connect();

	  return { db, logger };
  }
}
