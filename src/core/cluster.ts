import cluster from 'cluster';
import os from 'os';
import log from 'debug';

log('core:cluster');

/**
 * 
 * @param {*} App 
 */
export default <App>(App, configs) => {
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