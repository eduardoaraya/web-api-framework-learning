const Cluster = require('./core/cluster');
const { App } = require('./core/server');
const routes = require('./routes');
/**
 * @returns {App} 
 */
module.exports = Cluster(
  App,
  { routes: routes }
);