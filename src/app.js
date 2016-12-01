import Koa from 'koa';
import helmet from 'koa-helmet';
import enforceHttps from 'koa-sslify';
import config from './config';
import bodyParser from 'koa-bodyparser';
import views from 'koa-views';
import cors from 'kcors';
import router from './router';
import koaSwagger from 'koa2-swagger-ui';

const app = new Koa()
  .use(helmet()) /* For security */
  // .use(enforceHttps({ //TODO: force it in production
  //   trustProtoHeader: true
  // }))
  .use(views(__dirname + config.viewsDir, { extension: 'pug' }))  /* For Documentation: */
  .use(cors()) /* For security */
  .use(async (ctx, next) => { //HomeMadeLogger -- only for dev
    var start = new Date;
    await next;
    var ms = new Date - start;
    console.log('%s %s - %s', ctx.method, ctx.url, ms);
    await next();
  })
  .use(koaSwagger({ /* For Documentation: */
    routePrefix: '/swagger',
    swaggerOptions: {
      url: `http://127.0.0.1:${config.port}/api-docs`,
    },
  }))
  .use(async (ctx, next) => {
    ctx.state.authorizationHeader = 'Key ' + config.key;
    await next();
  })
  .use(bodyParser({
    extendTypes: {
      json: ['application/x-javascript']
    }
  }))
  /* --- Routes --- ROOT */
  .use(router.root.routes())
  .use(router.root.allowedMethods())
  /* --- Routes --- API */
  .use(router.api.routes())
  .use(router.api.allowedMethods());
  
export default app;
