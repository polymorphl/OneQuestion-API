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
const mixed_shortcode_length = 24;
// ??? Add magic 2 chars on random generated position ?

/* -------------------------------------------------------------------------- */
/* GET ROUTES */
/* -------------------------------------------------------------------------- */

/*
  GET - /question/:contributor_shortcode
  PARAMS REQUIRED
  - :contributor_shortcode
*/
api.get('/question/:share_shortcode',
// Handle request
async (ctx, next) => {
  if (ctx.params.share_shortcode.toString().length === share_shortcode_length) {
    //valid key
    await helper.getQuestionByShareShortcode(ctx.params.share_shortcode,
    ['responses',  'responses.contributor', 'owner',], function(c, d) {
      if (c === 0) {
        ctx.body  = d;
      }
    });
  }
});

/*
  GET - /question/:mixed_shortcode/admin
  PARAMS REQUIRED
  - :mixed_shortcode
*/
api.get('/question/:mixed_shortcode/admin',
// Handle request
async (ctx, next) => {
  if (ctx.params.mixed_shortcode.toString().length === mixed_shortcode_length) {
    //valid key
    await new Owner({ contributor_id: ctx.params.mixed_shortcode }).fetch({ withRelated: [{
      'question': function(qb) {
        qb.columns('question_id', 'question')
      }
    }]}).then(function(data) {
      let resp = data.models;
      ctx.body = resp;
    }).catch(function(error) {
      console.log('ERR', error);
    });
  } else {
    ctx.body = { error: true, data: 'Invalid data' }
  }
  
});

/* -------------------------------------------------------------------------- */
/* POST ROUTES */
/* -------------------------------------------------------------------------- */

/*
 { DONE }
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

       // TODO checks if 2 requests has been done


      // Email
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
  { DONE }
  POST - /question/:share_shortcode
  PARAMS REQUIRED
  - share_shortcode
*/
api.post('/question/:share_shortcode',
// Handle request: new Response to a question
async (ctx, next) => {
 let data = {
    email: (ctx.request.body.email && ctx.request.body.email != "" ? ctx.request.body.email: -1),
    firstname: (ctx.request.body.firstname && ctx.request.body.firstname != "" ? ctx.request.body.firstname: -1),
    response: (ctx.request.body.response && ctx.request.body.response != "" ? ctx.request.body.response: -1)
  }
  let share_shortcode = ctx.params.share_shortcode;
 
  if (share_shortcode.length === share_shortcode_length) {
     // Valid length for share_shortcode
    if (!parseInt(data.email, 10) && !parseInt(data.response, 10) && !parseInt(data.firstname, 10)) {
      //check email
      if (isEmail(data.email)) {
         // Generate tokens
        let contributorToken = randomstring.generate(contributor_shortcode_length);
        let context = {
          share_shortcode: share_shortcode,
          contributor: {},
          question: {},
          response: {}
        }

        // DB Action here!
        await helper.getQuestionByShareShortcode(share_shortcode, [], function(c, d){
          if (c === 0) {
            context.question = d.attributes;
            // Delete unused variable (TODO remove columns in bookshelf)
            delete context.question.owner_shortcode;
          } else {
            ctx.body = { error: true, data: 'Cannot find related question' }
          }
        });
        
        if (parseInt(context.question.id)) {
          // a valid ID is given after resolve
          // DB Action here!
          await helper.createResponse(context.question.id,
                                    contributorToken, data.response, function(c, d) {
            if (c === 0) {
              context.response = d;
            } else {
              ctx.body = { error: true, data: 'Cannot create response' }
            }
          });
          await helper.createContributor(context.response.id, contributorToken, data.email, data.firstname, function(c, d) {
            if (c === 0) {
              context.contributor = d;
            } else {
              ctx.body = { error: true, data: 'Cannot create contributor' }
            }
          });

          // TODO checks if 2 requests has been done

          // Email
          let emailVars = {
            contributor_shortcode: contributorToken,
            mixed_shortcode: contributorToken + share_shortcode,
            templateFile: 'welcome_contributor'
          }
          await sendEmail('lucterracher@lecrew.bdx', data.email, '[One Question] your links', emailVars, function(c, d) {
            if (c === 0) {
              console.log('NEW EMAIL SENT (on mailtrap.io in DEV)=>', d.envelope);
            } else {
              console.log('Mail not send');
            }
          });

          // Response
          ctx.body = {
            error: false,
            data: {
              contributor_shortcode: contributorToken,
              question: context.question,
            }
          }
        } else {
          ctx.body = { error: true, data: 'The related question cannot be found' }
        }
      } else {
        ctx.body = { error: true, data: 'Invalid data' }
      }
    } else {
      ctx.body = { error: true, data: 'Invalid data' }
    }
  } else {
    ctx.body = { error: true, data: 'Invalid data' }
  }

});


/*
 { DONE }
  POST - /question/:mixed_shortcode/admin'
  PARAMS REQUIRED
  - mixed_shortcode (owner_shortcode + share_shortcode)
*/
api.post('/question/:mixed_shortcode/edit',
// Handle request: edit question entity
async (ctx, next) => {
    let data = {
      question: (ctx.request.body.question && ctx.request.body.question != "" ? ctx.request.body.question : -1)
    }
    let mixed_shortcode = ctx.params.mixed_shortcode;

    // TODO find share_shortcode
    let share_shortcode = helper.extractMixed(mixed_shortcode)[1];

    if (mixed_shortcode.length === mixed_shortcode_length) {
     // Valid length for share_shortcode
      if (!parseInt(data.question, 10)) {
        // Valid data
        let context = {
          question: {},
          edited: null
        }

        // DB Action here!
        await helper.getQuestionByShareShortcode(share_shortcode, [], function(c, d){
          if (c === 0) {
            context.question = d.attributes;
            // Delete unused variable (TODO remove columns in bookshelf)
            
          } else {
            ctx.body = { error: true, data: 'Cannot find related question' }
          }
        });

        if (context.question.owner_shortcode === helper.extractMixed(mixed_shortcode)[0]) {
          // question is link to owner_shortcode received in params
          delete context.question.owner_shortcode;
          if (parseInt(context.question.id, 10)) {
            // a valid ID is given after resolve

            // DB Action here!
            await helper.editQuestion(context.question.id, data.question, function(c, d) {
              if (c === 0) {
                context.question = d.attributes;
                context.edited = true;
              } else {
                ctx.body = { error: true, data: 'Cannot edit question' }
              }
            });

            // Response
            ctx.body = {
              error: false,
              data: context
            }

          } else {
            ctx.body = { error: true, data: 'The related question cannot be found' }
          }
        } else {
          ctx.body = { error: true, data: 'This is not your question' }
        }
      } else {
        ctx.body = { error: true, data: 'Invalid data' }
      }
    } else {
      ctx.body = { error: true, data: 'Invalid data' }
    }
});


/*
 { DONE }
  POST - /response/:mixed_shortcode/edit'
  PARAMS REQUIRED
  - mixed_shortcode (contributor_shortcode + share_shortcode)
*/
api.post('/response/:mixed_shortcode/edit',
// Handle request: edit question entity
async (ctx, next) => {
    let data = {
      response: (ctx.request.body.response && ctx.request.body.response != "" ? ctx.request.body.response : -1)
    }
    let mixed_shortcode = ctx.params.mixed_shortcode;

    // TODO find share_shortcode
    let contributor_shortcode = helper.extractMixed(mixed_shortcode)[0];

    if (mixed_shortcode.length === mixed_shortcode_length) {
     // Valid length for share_shortcode
      if (!parseInt(data.response, 10)) {
        // Valid data
        let context = {
          response: {},
          edited: null
        }

        // DB Action here!
        await helper.getResponseByContribShortcode(contributor_shortcode, [], function(c, d){
          if (c === 0) {
            context.response = d.attributes;
          } else {
            ctx.body = { error: true, data: 'Cannot find related response' }
          }
        });

        if (context.response.contributor_shortcode === helper.extractMixed(mixed_shortcode)[0]) {
          // response is link to contributor_shortcode received in params
          if (parseInt(context.response.id, 10)) {
            // a valid ID is given after resolve

            // DB Action here!
            await helper.editResponse(context.response.id, data.response, function(c, d) {
              if (c === 0) {
                context.response = d.attributes;
                context.edited = true;
              } else {
                ctx.body = { error: true, data: 'Cannot edit Response' }
              }
            });

            // Response
            ctx.body = {
              error: false,
              data: context
            }

          } else {
            ctx.body = { error: true, data: 'The related response cannot be found' }
          }
        } else {
          ctx.body = { error: true, data: 'This is not your response' }
        }
      } else {
        ctx.body = { error: true, data: 'Invalid data' }
      }
    } else {
      ctx.body = { error: true, data: 'Invalid data' }
    }
});


/*
 { DONE }
 POST - /question/:mixed_shortcode/delete
 PARAMS REQUIRED
  - mixed_shortcode (owner_shortcode + share_shortcode)
*/
api.post('/question/:mixed_shortcode/delete',
// Handle request: delete question entity
async (ctx, next) => {
    let mixed_shortcode = ctx.params.mixed_shortcode;

    if (mixed_shortcode.length === mixed_shortcode_length) {
     // Valid length for share_shortcode

        let context = {
          question: {},
          deleted: null
        }
        
        // find share_shortcode
        let share_shortcode = helper.extractMixed(mixed_shortcode)[1];

        // DB Action here!
        await helper.getQuestionByShareShortcode(share_shortcode, [], function(c, d){
          if (c === 0) {
            context.question = d.attributes;
            // Delete unused variable (TODO remove columns in bookshelf)
            
          } else {
            ctx.body = { error: true, data: 'Cannot find related question' }
          }
        });

        if (context.question.owner_shortcode === helper.extractMixed(mixed_shortcode)[0]) {
          // question is link to owner_shortcode received in params
          delete context.question.owner_shortcode;
          if (parseInt(context.question.id, 10)) {
            // a valid ID is given after resolve

            // DB Action here!
            await helper.deleteQuestion(context.question.id, function(c, d) {
              if (c === 0) {
                console.log(d);
                context.deleted = true;
              } else {
                ctx.body = { error: true, data: 'Cannot delete question' }
              }
            });

            // Response
            ctx.body = {
              error: context.deleted ? context.deleted : false,
              data: context
            }

          } else {
            ctx.body = { error: true, data: 'The related question cannot be found' }
          }
        } else {
          ctx.body = { error: true, data: 'This is not your question' }
        }

    } else {
      ctx.body = { error: true, data: 'Invalid data' }
    }
});

// { DONE }
// POST - /response/:mixed_shortcode/delete
api.post('/response/:mixed_shortcode/delete',
// Handle request: delete response entity
async (ctx, next) => {
    let mixed_shortcode = ctx.params.mixed_shortcode;

    if (mixed_shortcode.length === mixed_shortcode_length) {
     // Valid length for mixed_shortcode

        let context = {
          response: {},
          deleted: null
        }
        
        // find contributor_shortcode
        let contributor_shortcode = helper.extractMixed(mixed_shortcode)[0];

        // DB Action here!
        await helper.getResponseByContribShortcode(contributor_shortcode, [], function(c, d){
          if (c === 0) {
            context.response = d.attributes;
          } else {
            ctx.body = { error: true, data: 'Cannot find related response' }
          }
        });

        if (context.response.contributor_shortcode === contributor_shortcode) {
          // response is link to contributor_shortcode received in params
          if (parseInt(context.response.id, 10)) {
            // a valid ID is given after resolve

            // DB Action here!
            await helper.deleteResponse(context.response.id, function(c, d) {
              if (c === 0) {
                context.deleted = true;
              } else {
                ctx.body = { error: true, data: 'Cannot delete response' }
              }
            });

            // Response
            ctx.body = {
              error: context.deleted ? context.deleted : false,
              data: context
            }

          } else {
            ctx.body = { error: true, data: 'The related response cannot be found' }
          }
        } else {
          ctx.body = { error: true, data: 'This is not your response' }
        }
    } else {
      ctx.body = { error: true, data: 'Invalid data' }
    }
});

/* -------------------------------------------------------------------------- */
/* DEBUG ROUTES, FOR BACK OFFICE */
/* -------------------------------------------------------------------------- */

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
