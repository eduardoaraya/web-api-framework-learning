/**
 * @version 0.0
 * @author Eduardo Felipe Araya Jezine 
 * @year 2021
 * @release 2021-02-04 0.0.0
 * @github eduardoaraya  
 */

import path from 'path';

export enum APP_MODE {
  PRODUCTION = 'productions',
  DEVELOPMENT = 'develop'
}

/**
 * Import environments
 */
import('dotenv')
  .then(dotEnv =>
    dotEnv.config({
      path: process.env.NODE_ENV === APP_MODE.DEVELOPMENT
        ? path.basename('../.env.development')
        : path.basename('../.env')
    })
  )

import Cluster from './core/cluster';
import App from './core/server';
import routes from './routes';

/**
 * @returns {App} 
 */
Cluster<App>(
  App,
  { routes: routes }
);