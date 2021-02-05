/**
 * @version 0.0
 * @author Eduardo Felipe Araya Jezine 
 * @year 2021
 * @release 2021-02-04 0.0.0
 * @github eduardoaraya  
 */
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