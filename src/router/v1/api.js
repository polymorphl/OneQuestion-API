import KoaRouter from 'koa-router';
import models from '../../models';
import randomstring from 'randomstring';
import async from 'async';
import waterfall from 'async-waterfall';
import isEmail from 'validator/lib/isEmail'; // https://www.npmjs.com/package/validator

import helper from './helper';

const Question = models.Question;
const Response = models.Response;
const Owner = models.Owner;
const Contributor = models.Contributor;

import sendEmail from '../../../config/mailer';

const api = KoaRouter({ prefix: '/v1' });

const randomstringLength = 12;



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
  await new Contributor({ contributor_id: ctx.params.contributorId }).fetch({ withRelated: [{
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
  await new Owner({ contributor_id: ctx.params.ownerId }).fetch({ withRelated: [{
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
    firstname: (ctx.request.body.firstname && ctx.request.body.firstname != "" ? ctx.request.body.firstname: -1),
    question: (ctx.request.body.question && ctx.request.body.question != "" ? ctx.request.body.question: -1)
  }
  if (!parseInt(data.email, 10) && !parseInt(data.question, 10) && !parseInt(data.firstname, 10)) {
    //check email
    if (isEmail(data.email)) {
      // Generate token here!
      let ownerToken = randomstring.generate(randomstringLength);
      let contributorToken = randomstring.generate(randomstringLength);
      // DB Action here!
      await new Question({
        owner_id: ownerToken,
        contributor_id: contributorToken,
        question: data.question,
        created_at: new Date(),
      }).save().then(function(question) {
        console.log(question.attributes);
        let context = {
          ownerid:  question.attributes.owner_id,
          contributorid: question.attributes.contributor_id
        }
        //TODO finish helper.js + send correct email
        // sendEmail('lucterracher@lecrew.bdx', data.email, '[One Question] your links', context, function(code, emailResponse) {
        //   if (code === 0) {
        // ctx.body = {
        //   error: false,
        //   owner_id: context.ownerid,
        //   contributor_id: context.contributorid
        // }
        //     console.log(`Email has been send to ${data.email}`, emailResponse.response);
        //   }
        // })

        // Response
        ctx.body = {
          error: false,
          owner_id: context.ownerid,
          contributor_id: context.contributorid
        }
      }).catch(function(error) {
        console.log('Question cannot be created', error);
      });
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



/* -------------------------------------------------------------------------- */
//DEBUG ROUTES, TODO DELETE FOR PRODUCTION

api.get('/questions',
// Handle request: All questions
async (ctx, next) => {
  await helper.getQuestions(function(code, data) {
    if (code === 0) {
      ctx.body = { error: false, data: data }
    }
  });
});
api.get('/responses',
// Handle request: All responses
async (ctx, next) => {
  await helper.getResponses(function(code, data) {
    if (code === 0) {
      ctx.body = { error: false, data: data }
    }
  });
});
api.get('/owners',
// Handle request: All owners
async (ctx, next) => {
  await helper.getOwners(function(code, data) {
    if (code === 0) {
      ctx.body = { error: false, data: data }
    }
  });
});
api.get('/contributors',
// Handle request: All contributors
async (ctx, next) => {
  await helper.getContributors(function(code, data) {
    if (code === 0) {
      ctx.body = { error: false, data: data }
    }
  });
});


api.get('/getall',
// Handle request: All data for admin dashboard
async (ctx, next) => {
  await helper.getAll(function(code, data) {
    if (code === 0) {
      ctx.body = { error: false, data: data }
    }
  });
});

export default api;
