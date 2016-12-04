// for protected route, validate auth key as middleware - Else, 401 in your face

import models from '../../models';

const Question = models.Question;
const Response = models.Response;
const Owner = models.Owner;
const Contributor = models.Contributor;

const validateKey = async (ctx, next) => {
  const { authorization } = ctx.request.headers;
  if (authorization !== ctx.state.authorizationHeader) {
    return ctx.throw(401);
  }
  await next();
}

function extractAttrs(array) {
  var tmp = [];
  for (var i = 0; i < array.length; i++) {
    tmp.push(array[i].attributes);
  }
  return tmp;
}

async function getResponses(cb) {
  await new Response().fetchAll({ withRelated: [{
    'question': function(qb) {
      qb.columns('owner_id', 'question')
    }
  }]}).then(function(data) {
    cb(0, extractAttrs(data.models));
  }).catch(function(error) {
    cb(1, error);
    console.log('ERROR', error);
  });
}

function getResponse(id, cb) {

}

async function getQuestions(cb) {
  await new Question().fetchAll({ withRelated: [{
    'responses': function(qb) {
      qb.columns('owner_id', 'question_id', 'response')
    }
  }]}).then(function(data) {
    cb(0, extractAttrs(data.models));
  }).catch(function(error) {
    cb(1, error);
    console.log('ERROR', error);
  });
}

function getQuestion(id, cb) {

}

async function getOwners(cb) {
  await new Owner().fetchAll().then(function(data) {
    cb(0, extractAttrs(data.models));
  }).catch(function(error) {
    cb(1, error);
    console.log('ERROR', error);
  });
}

function getOwner(id, cb) {

}

async function getContributors(cb) {
  await new Contributor().fetchAll().then(function(data) {
    cb(0, extractAttrs(data.models));
  }).catch(function(error) {
    cb(1, error);
    console.log('ERROR', error);
  });
}

function getContributor(id, cb) {

}

function createQuestion() {

}

function createOwner() {

}

function createContributor() {

}

function createResponse() {

}


export default {
  getQuestions,
  getResponses,
  getOwners,
  getContributors
};
