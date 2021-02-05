const http = require('http');
const domain = require('domain');
const log = require('debug')('core:app');
const path = require('path');

require('dotenv')
  .config({
    path: path.basename('../.env')
  });

const PRODUCTION_FLAG = 'production';
const DEVELOPMENT_FLAG = 'develop';

/**
 *
 */
class App {
  /**
   * @type {Object}
   */
  #server;
  /**
   * @type {Object}
   */
  #routes = {
    '404': (req, res) => res.end('Page not found!')
  };
  /**
   * @type {Array}
   */
  #handles = [
    (req, res) => this.#handleRoutes(req.url, { req, res })
  ];
  /**
   * 
   * @param {*} configs 
   */
  constructor({ routes }) {
    this.#server = http
      .createServer((req, res) => this.#middlewares(req, res))
      .listen(
        App.getPort(),
        'localhost',
        0,
        () => {
          log('> Connection on port:', App.getPort());
        }
      )
    routes(this);
  }

  #handleRoutes(path, { req, res }) {
    this.#routes[path] && typeof this.#routes[path] === 'function'
      ? this.#routes[path](req, res)
      : this.#routes['404'](req, res);
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  async #middlewares(req, res) {
    return Promise.all([
      ...this.#handles.map(async handle => {
        return await handle.apply(this, [req, res]);
      })
    ]).then(res => log('Proccess,', res))
  }

  use(handle) {
    this.#handles.push(handle);
  }

  route(path, callback) {
    this.#routes[path] = callback;
  }

  /**
   * 
   */
  getServer() {
    return this.#server;
  }

  /**
   * @returns {String}
   */
  static getPort() {
    return process.env.SERVER_PORT;
  }

  /**
   * @returns {true}
   */
  static isProduction() {
    return process.env.APP_MODE === PRODUCTION_FLAG;
  }

  /**
   * 
   * @returns {true}
   */
  static isDevelopment() {
    return process.env.APP_MODE === DEVELOPMENT_FLAG;
  }
}

module.exports = {
  App
}