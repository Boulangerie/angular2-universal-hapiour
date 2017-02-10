import './polyfills.ts'
import * as path from 'path'
import * as _ from 'lodash'
import { enableProdMode } from '@angular/core'
import { AppModule } from './app/app.node.module'
import { environment } from './environments/environment'
import { routes } from './server.routes'

import { Server, Request, IReply, Response } from 'hapi'
import { App, Inject, IApp, bootstrap } from 'hapiour'
import hapiEngine from './hapi-engine'
import { Api } from './app/server/api.server'

// App

const ROOT = path.join(path.resolve(__dirname, '..'))
const port = environment.here.port

/**
 * enable prod mode for production environments
 */
if (environment.production) {
  enableProdMode()
}

@App({
  port: port
})
@Inject([Api])
export class MyApp implements IApp {

  private server: Server

  public constructor(server: Server) {
    this.server = server
  }

  /**
   * bootstrap universal app
   * @param request
   * @param reply
   */
  private static ngApp(request, reply) {
    const url = `${request.connection.info.protocol}://${request.info.host}${request.url.path}`
    reply.view('index', {
      request: request,
      req: request.raw.req,
      res: request.raw.res,
      ngModule: AppModule,
      preboot: true,
      baseUrl: '/',
      requestUrl: url,
      originUrl: request.info.hostname
    }, {
      path: path.join(ROOT, 'dist'),
      layout: false
    })
  }

  public onInit(): void {

    this.server.register([require('inert'), require('vision')], (err) => {
      if (err) {
        throw err
      }

      /**
       * use universal for specific routes
       */
      this.server.route({
        method: 'GET',
        path: '/',
        handler: MyApp.ngApp
      })

      routes.forEach(route => {
        this.server.route({
          method: 'GET',
          path: `/${route}`,
          handler: MyApp.ngApp
        })
        this.server.route({
          method: 'GET',
          path: `/${route}/{p*}`,
          handler: MyApp.ngApp
        })
      })

      /**
       * serve static files
       */
      this.server.route({
        method: 'GET',
        path: '/{file*}',
        handler: {
          directory: {
            path: path.join(ROOT, 'dist')
          }
        }
      })

    /**
     * if you want to use universal for all routes, you can use the '*' wildcard
     */
      this.server.ext('onPostHandler', (request: Request, reply: IReply) => {
        const response: Response = request.response
        if (response.isBoom && (<any>response).output.statusCode === 404) {
          const pojo = {
            status: 404,
            message: 'No Content'
          }
          const json = JSON.stringify(pojo, null, 2)
          return reply(json)
            .header('Content-Type', 'application/json')
            .code(404)
        } else {
          return reply.continue()
        }
      })

      /**
       * Hapijs View
       */
      this.server.views({
        engines: {
          html: {
            module: hapiEngine,
            compileMode: 'async'
          }
        },
        path: path.join(ROOT, 'src/app'),
        layoutPath: path.join(ROOT, 'src/app')
      })
    })

  }

  public onStart(): void {
    console.log('server started', _.extend({},
      this.server.info,
      {
        'internalConfig': environment
      }
    ))
  }

}

bootstrap(MyApp)
