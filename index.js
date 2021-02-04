const cluster = require('./core/cluster');
const {
  App
} = require('./core/server');
const routes = require('./routes');

cluster(App, {
  routes: routes
})