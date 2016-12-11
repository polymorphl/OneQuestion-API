import KoaRouter from 'koa-router';
import models from '../../models';
import randomstring from 'randomstring';
import isEmail from 'validator/lib/isEmail'; // https://www.npmjs.com/package/validator

import helper from './helper';

const Question = models.Question;
const Response = models.Response;
const Owner = models.Owner;
const Contributor = models.Contributor;

import sendEmail from '../../../config/mailer';

const api = KoaRouter({ prefix: '/v1' });

const randomstringLength = 12;

//Trick the system NOW!
const owner_shortcode_length = 12;
const share_shortcode_length = 12;
const contributor_shortcode_length = 12;
const mixed_shortcode = 14; // Add magic 2 chars on random generated position ?

/*
  GET - /question/:contributorId
  PARAMS REQUIRED
  - :contributorId
*/
api.get('/question/:share_shortcode',
// Handle request
async (ctx, next) => {
  if (ctx.params.share_shortcode.toString().length === share_shortcode_length) {
    //valid key
    await helper.getQuestionByShareShortcode(ctx.params.share_shortcode, function(c, d) {
      if (c === 0) {
        ctx.body  = d;
      }
    });
  }
});

/*
  GET - /question/:ownerId/admin
  PARAMS REQUIRED
  - :ownerId
*/
api.get('/question/:ownerId/admin',
// Handle request
async (ctx, next) => {
  if (ctx.params.contributorId.toString().length === randomstringLength) {
    //valid key
  }
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
      // Generate tokens
      let ownerToken = randomstring.generate(randomstringLength);
      let shareToken = randomstring.generate(randomstringLength);
      let question_data = {};
      let owner_data = {};
      let all = {
        share_shortcode: shareToken,
        mixed_shortcode: (ownerToken + shareToken),
        templateFile: 'welcome'
      };
      // DB Action here!
      await helper.createQuestion(ownerToken, shareToken, data.question, function(c, d) {
        if (c === 0) {
          question_data = d;
        } else {
          ctx.body = { error: true, data: 'Cannot create question' }
        }
      });
      await helper.createOwner(question_data.id, question_data.owner_shortcode, data.email, data.firstname, function(c, d) {
        if (c === 0) {
          owner_data = d;
        } else {
          ctx.body = { error: true, data: 'Cannot create owner' }
        }
      });
      await sendEmail('lucterracher@lecrew.bdx', data.email, '[One Question] your links', all, function(c, d) {
        if (c === 0) {
          console.log('NEW EMAIL SENT (on mailtrap.io in DEV)=>', d.envelope);
        } else {
          console.log('Mail not send');
        }
      });
      ctx.body = {
        error: false,
        owner_data: owner_data,
        share_shortcode: shareToken
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
    ctx.body = {
        error: false
    }
});

/*
  POST - /question/:ownerId/admin'
  PARAMS REQUIRED
  - ownerId
*/
api.post('/question/:ownerId/admin',
// Handle request: edit question entity
async (ctx, next) => {
    ctx.body = {
        error: false
    }
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
