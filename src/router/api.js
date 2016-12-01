import KoaRouter from 'koa-router';
import isEmail from 'validator/lib/isEmail'; // https://www.npmjs.com/package/validator

const api = KoaRouter({ prefix: '/v1' });

/*

get / -- X -- Sera fait par le Front
get /question/:contributorId --  OK
get /question/:ownerId/admin --  OK
get /created                 --  OK

*/

/*
  GET - /created
*/
api.get('/created',
// Handle request
async (ctx, next) => {
 ctx.status = 200;
});

/*
  GET - /question/:contributorId
  PARAMS REQUIRED
  - :contributorId
*/
api.get('/question/:contributorId',
// Handle request
async (ctx, next) => {
  ctx.status = 200;
});

/*
  GET - /question/:ownerId/admin
  PARAMS REQUIRED
  - :ownerId
*/
api.get('/question/:ownerId/admin',
// Handle request
async (ctx, next) => {
 ctx.body = {
   data: ctx.params.ownerId
 }
});


/* -------------------------------------------------------------------------- */

/*
post /create         (2)
post /question/:contributorId
post /question/:ownerId/admin
*/

/*
  POST - /create
  PARAMS BODY REQUIRED
  - email
  - question
*/
api.post('/create',
// Handle request
async (ctx, next) => {
  let data = {
    email: (ctx.request.body.email && ctx.request.body.email != "" ? ctx.request.body.email: -1),
    question: (ctx.request.body.question && ctx.request.body.email != "" ? ctx.request.body.question: -1)
  }
  if (!parseInt(data.email, 10) && !parseInt(data.question, 10)) {
    //check email
    if (isEmail(data.email)) {
      // DB Action HERE
      // Response
      ctx.body = { error: false, data: 'TODO SAVE IN DB + RESpponse generated token' }
    } else {
      ctx.body = { error: true, data: 'Invalid data' }
    }
  } else {
    // Response
    ctx.body = { error: true, data: 'Invalid data' }
  }

});

export default api;
