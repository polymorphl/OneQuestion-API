import KoaRouter from 'koa-router';
import models from '../models';
import isEmail from 'validator/lib/isEmail'; // https://www.npmjs.com/package/validator

const Question = models.Question;
const Response = models.Response;
const Owner = models.Owner;
const Contributor = models.Contributor;

const api = KoaRouter({ prefix: '/v1' });

//Test TOTO move it bottom

api.get('/questions',
// Handle request: All questions
async (ctx, next) => {
  await new Question().fetchAll({ withRelated: [{
    'responses': function(qb) {
      qb.columns('id', 'owner_id', 'question_id', 'response')
    }
  }]}).then(function(data) {
    let resp = data.models;
    console.log(resp);
    ctx.body = resp;
  }).catch(function(error) {
    console.log('ERR', error);
  });
  // ctx.status = 200;
});


/*

get / -- X -- Sera fait par le Front
get /question/:contributorId --  OK
get /question/:ownerId/admin --  OK

*/

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
// Handle request: save the question
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
      ctx.body = {
        error: false,
        data: 'TODO SAVE IN DB + RESpponse generated token' + 'ownerId: contributorId:'
      }
    } else {
      ctx.body = { error: true, data: 'Invalid data' }
    }
  } else {
    // Response
    ctx.body = { error: true, data: 'Invalid data' }
  }
});

/*
  POST - /question/:contributorId
  PARAMS REQUIRED
  - contributorId
*/
api.post('/question/:contributorId',
// Handle request: new Response to a question
async (ctx, next) => {
  ctx.status = 200;
});

/*
  POST - /question/:ownerId/admin'
  PARAMS REQUIRED
  - ownerId
*/
api.post('/question/:ownerId/admin',
// Handle request: edit question entity
async (ctx, next) => {
  ctx.status = 200;
});

//DEBUG ROUTES, TODO DELETE FOR PRODUCTION

api.get('/responses',
// Handle request: All responses
async (ctx, next) => {
  ctx.status = 200;
});
api.get('/owners',
// Handle request: All owners
async (ctx, next) => {
  ctx.status = 200;
});
api.get('/contributors',
// Handle request: All contributors
async (ctx, next) => {
  ctx.status = 200;
});


export default api;
