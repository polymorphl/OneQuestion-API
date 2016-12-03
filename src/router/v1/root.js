import KoaRouter from 'koa-router';
import send from 'koa-send';

const root = KoaRouter();

root.get('/api-docs',
// Handle rendering for documentation
async (ctx, next) => {
  await send(ctx, '/swagger.json', { root: __dirname + '/../' });
})

export default root;
