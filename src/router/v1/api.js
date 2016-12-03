import KoaRouter from 'koa-router';
import models from '../../models';
import isEmail from 'validator/lib/isEmail'; // https://www.npmjs.com/package/validator

const Question = models.Question;
const Response = models.Response;
const Owner = models.Owner;
const Contributor = models.Contributor;

const api = KoaRouter({ prefix: '/v1' });

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
  await new Contributor({ contributor_id: ctx.params.contributorId }).fetchAll({ withRelated: [{
    'owner': function(qb) {
      qb.columns('owner_id', 'email', 'firstname')
    }
  }]}).then(function(data) {
    let resp = data.models;
    ctx.body = resp;
  }).catch(function(error) {
    console.log('ERR', error);
  });
});

/*
  GET - /question/:ownerId/admin
  PARAMS REQUIRED
  - :ownerId
*/
api.get('/question/:ownerId/admin',
// Handle request
async (ctx, next) => {
  await new Owner({ contributor_id: ctx.params.ownerId }).fetchAll({ withRelated: [{
    'question': function(qb) {
      qb.columns('question_id', 'question')
    }
  }]}).then(function(data) {
    let resp = data.models;
    ctx.body = resp;
  }).catch(function(error) {
    console.log('ERR', error);
  });
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
  await new Owner({owner_id: ctx.params.owner_id}).fetchAll({ withRelated: [{
    'question': function(qb) {
      qb.columns('owner_id', 'contributor_id', 'question')
    }
  }]}).then(function(data) {
    let resp = data.models;
    ctx.body = resp;
  }).catch(function(error) {
    console.log('ERR', error);
  });
});

//DEBUG ROUTES, TODO DELETE FOR PRODUCTION

api.get('/questions',
// Handle request: All questions
async (ctx, next) => {
  await new Question().fetchAll({ withRelated: [{
    'responses': function(qb) {
      qb.columns('owner_id', 'question_id', 'response')
    },
    // 'contributor': function(qb) {
    //   qb.columns('contributor_id', 'email', 'firstname')
    // }
  }]}).then(function(data) {
    let resp = data.models;
    console.log(resp);
    ctx.body = resp;
  }).catch(function(error) {
    console.log('ERR', error);
  });
  // ctx.status = 200;
});
api.get('/responses',
// Handle request: All responses
async (ctx, next) => {
  await new Response().fetchAll({ withRelated: [{
    'question': function(qb) {
      qb.columns('owner_id', 'question')
    },
    // 'contributor': function(qb) {
    //   qb.columns('contributor_id', 'email', 'firstname')
    // }
  }]}).then(function(data) {
    let resp = data.models;
    console.log(resp);
    ctx.body = resp;
  }).catch(function(error) {
    console.log('ERR', error);
  });
});
api.get('/owners',
// Handle request: All owners
async (ctx, next) => {
  await new Owner().fetchAll({ withRelated: [{
    'question': function(qb) {
      qb.columns('owner_id', 'question')
    },
    // 'contributor': function(qb) {
    //   qb.columns('contributor_id', 'email', 'firstname')
    // }
  }]}).then(function(data) {
    let resp = data.models;
    console.log(resp);
    ctx.body = resp;
  }).catch(function(error) {
    console.log('ERR', error);
  });
});
api.get('/contributors',
// Handle request: All contributors
async (ctx, next) => {
  await new Contributor().fetchAll({ withRelated: [{
    'owner': function(qb) {
      qb.columns('owner_id', 'email', 'firstname')
    },
    // 'contributor': function(qb) {
    //   qb.columns('contributor_id', 'email', 'firstname')
    // }
  }]}).then(function(data) {
    let resp = data.models;
    ctx.body = resp;
  }).catch(function(error) {
    console.log('ERR', error);
  });
});


export default api;
