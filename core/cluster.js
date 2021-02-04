const cluster = require('cluster');
const os = require('os');
const log = require('debug')('core:cluster');

/**
 * 
 * @param {*} App 
 */
module.exports = (App, configs) => {
  if (cluster.isMaster) {
    if (App.isProduction()) {
      os.cpus()
        .forEach(core => cluster.fork())
      log(os.cpus().length + " clusters on");
    }
    if (App.isDevelopment()) {
      cluster.fork();
      cluster.fork();
      cluster.fork();
      log("3 clusters on");
    }
    cluster.on('disconnect', worker => {
      log('> Disconnect cluster');
      cluster.fork();
      log('> Reconect', cluster.worker?.id);
    })
  } else {
    return new App(configs);
  }
}