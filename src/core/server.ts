import http from 'http';
import domain from 'domain';
import log from 'debug';

log('debug')('core:app')


const PRODUCTION_FLAG = 'production';
const DEVELOPMENT_FLAG = 'develop';

type Response = http.ServerResponse;
type Request = http.IncomingMessage;
type Server = http.Server;

/**
 *
 */
export default class App {
  /**
   * @type {Object}
   */
  private server: any;
  /**
   * @type {Object}
   */
  private routes = {
    '404': (req, res) => res.end('Page not found!')
  };
  /**
   * @type {Array}
   */
  private handles = [
    (req, res) => this.handleRoutes(req.url, { req, res })
  ];
  /**
   * 
   * @param {*} configs 
   */
  constructor({ routes }) {
    this.start()
      .then(() => routes(this))
  }

  private start(): Promise<Server> {
    return new Promise((resolve, rejects) => {
      this.server = http
        .createServer((req: Request, res: Response): Promise<any[]> => this.middlewares(req, res))
        .listen(App.getPort(),
          () => {
            log('> Connection on port:', App.getPort());
            resolve(this.getServer())
          }
        )
    })
  }

  private handleRoutes(path: string, { req, res }: { req: Request, res: Response }) {
    this.routes[path] && typeof this.routes[path] === 'function'
      ? this.routes[path](req, res)
      : this.routes['404'](req, res);
  }

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  private async middlewares(req, res): Promise<any[]> {
    return Promise.all([
      ...this.handles.map((handle: any) => {
        handle = handle.apply(this, [req, res]);
        return handle;
      })
    ]);
  }

  private use(handle: any): void {
    this.handles.push(handle);
  }

  private route(path, callback): void {
    this.routes[path] = callback;
  }

  public getServer() {
    return this.server;
  }

  /**
   * @returns {String}
   */
  public static getPort(): number {
    return process.env.SERVER_PORT ? +process.env.SERVER_PORT : 3333;
  }

  /**
   * @returns {boolean}
   */
  public static isProduction(): boolean {
    return process.env.APP_MODE === PRODUCTION_FLAG;
  }

  /**
   * 
   * @returns {boolean}
   */
  public static isDevelopment(): boolean {
    return process.env.APP_MODE === DEVELOPMENT_FLAG;
  }
}