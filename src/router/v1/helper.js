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

function extractAttrsAndRelation(array) {
  var tmp = [];
  for (var i = 0; i < array.length; i++) {
    let attr = array[i].attributes;
    attr.relations = array[i].relations;
    tmp.push(attr);
  }
  return tmp;
}

async function getResponses(cb) {
  await new Response().fetchAll({ withRelated:
    ['contributor', 'question']
  }).then(function(data) {
    cb(0, extractAttrsAndRelation(data.models));
  }).catch(function(error) {
    cb(1, error);
    console.log('ERROR', error);
  });
}

async function getResponse(id, cb) {

}

// Questions + Reponses
async function getQuestions(cb) {
  await new Question().fetchAll({ withRelated:
    ['responses', 'owner', 'responses.contributor']
  }).then(function(data) {
    cb(0, extractAttrsAndRelation(data.models));
  }).catch(function(error) {
    cb(1, error);
    console.log('ERROR', error);
  });
}

/*
** == id
** => Question, Owner + (Reponses + contributor)
*/
async function getQuestionByShareShortcode(id, cb) {
  await new Question().byShare_shortcode(id).then(function(data) {
    if (data && data.attributes && data.attributes.id) {
      cb(0, data);
    } else {
      cb (2, 'no data')
    }
  }).catch(function(error) {
    cb(1, error);
    console.log('ERROR', error);
  });
}


async function getOwners(cb) {
  await new Owner().fetchAll({ withRelated:
    ['question']
  }).then(function(data) {
    cb(0, extractAttrsAndRelation(data.models));
  }).catch(function(error) {
    cb(1, error);
    console.log('ERROR', error);
  });
}

async function getOwner(id, cb) {

}

async function getContributors(cb) {
  await new Contributor().fetchAll({ withRelated:
    ['response']
  }).then(function(data) {
    cb(0, extractAttrsAndRelation(data.models));
  }).catch(function(error) {
    cb(1, error);
    console.log('ERROR', error);
  });
}

async function getContributor(id, cb) {

}

async function createQuestion(ownerToken, contributorToken, question, cb) {
  await new Question({
    owner_shortcode: ownerToken,
    share_shortcode:contributorToken,
    question: question,
    created_at: new Date()
  }).save().then(function(question) {
    cb(0, question.attributes);
  }).catch(function(error) {
    console.log('Question cannot be created', error);
    cb(1, 'Question cannot be insert');
  });
}

async function createOwner(question_id, owner_shortcode, email, firstname, cb) {
  await new Owner({
    question_id: question_id,
    owner_shortcode: owner_shortcode,
    email: email,
    firstname: firstname,
    created_at: new Date()
  }).save().then(function(owner) {
    cb(0, owner.attributes);
  }).catch(function(error) {
    console.log('Owner cannot be created', error);
    cb(1, 'Owner cannot be insert');
  });
}

async function createContributor() {

}

async function createResponse() {

}

async function getAll(cb) {
  let DB_obj = {};
  await getContributors(function(code, data) {
    if (code === 0) {
      DB_obj.contributors = data;
    }
  });
  await getOwners(function(code, data) {
    if (code === 0) {
      DB_obj.owners = data;
    }
  });
  await getResponses(function(code, data) {
    if (code === 0) {
      DB_obj.responses = data;
    }
  });
  await getQuestions(function(code, data) {
    if (code === 0) {
      DB_obj.questions = data;
    }
  });
  cb(0, DB_obj);
}

export default {
  getQuestions,
  getQuestionByShareShortcode,
  getResponses,
  getOwners,
  getContributors,
  getAll,
  createQuestion,
  createOwner
};
