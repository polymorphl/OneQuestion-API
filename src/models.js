import database from '../db/index';
var Promise = require('bluebird');

/*
  # Table: question
  Id,
  owner_shortcode,
  share_shortcode,
  question,
  timestamp X2
*/

var Question = database.Model.extend({
  tableName: 'questions',
  virtuals: {
    // For disabled: instance.toJSON({virtuals: true})
    mixed_shortcode: function() {
        return this.get('owner_shortcode') + this.get('share_shortcode');
    }
  },
  /* Methods */
  byOwner_shortcode: Promise.method(function(owner_shortcode) {
     return this.query({where:{ owner_shortcode: owner_shortcode }}).fetch(
       { withRelated:
         ['responses', 'owner', 'responses.contributor']
       });
  }),
  byShare_shortcode: Promise.method(function(share_shortcode, relations) {
    return this.query({where:{ share_shortcode: share_shortcode }}).fetch(
      { withRelated: relations });
  }),
 /* Relations */
  owner: function() {
    return this.hasOne(Owner);
  },
  contributor: function() {
    return this.hasOne(Contributor);
  },
  responses: function() {
    return this.hasMany(Response).query({where: {state: 1}});
  }
});


/*
  # Table: response
  Id,
  question_id,
  contributor_shortcode,
  response,
  timestamp X2
*/
var Response = database.Model.extend({
  tableName: 'responses',
  /* Methods */
  byQuestion_id: Promise.method(function(question_id) {
     return this.query({where:{ question_id: question_id }}).fetch();
  }),
  byContributor_shortcode: Promise.method(function(contributor_shortcode, relations) {
     return this.query({where:{ contributor_shortcode: contributor_shortcode }}).fetch(
       { withRelated: relations, virtuals: false });
  }),
  /* Relations */
  contributor: function() {
    return this.belongsTo(Contributor, 'id');
  },
  question: function() {
    return this.belongsTo(Question, 'id').query({where: {state: 1}});
  }
});


/*
  # Table: owner
  Id,
  question_id,
  owner_shortcode,
  firstname,
  email,
  timestamp X2
*/
var Owner = database.Model.extend({
  tableName: 'owners',
  /* Methods */
  byQuestion_id: Promise.method(function(question_id) {
     return this.query({where:{ question_id: question_id }}).fetch({ withRelated:
       []
     });
  }),
  byOwner_shortcode: Promise.method(function(owner_shortcode) {
     return this.query({where:{ owner_shortcode: owner_shortcode }}).fetch({ withRelated:
       []
     });
  }),
  byEmail: Promise.method(function(email) {
    return this.query({where:{ email: email }}).fetch({ withRelated:
      []
    });
  }),
  /* Relations */
  question: function() {
    return this.belongsTo(Question, 'id').query({where: {state: 1}});
  }
});


/*
  # Table: contributor
  Id,
  response_id,
  contributor_shortcode,
  email,
  firstname,
  timestamp X2
*/
var Contributor = database.Model.extend({
  tableName: 'contributors',
  /* Methods */
  byContributor_shortcode: Promise.method(function(contributor_shortcode, relations) {
     return this.query({where:{ contributor_shortcode: contributor_shortcode }}).fetch(
       { withRelated:relations });
  }),
  byResponse_id: Promise.method(function(response_id) {
    return this.query({where:{ response_id: response_id }}).fetch();
  }),
  byEmail: Promise.method(function(email) {
    return this.query({where:{ email: email }}).fetch();
  }),
  /* Relations */
  response: function() {
    return this.belongsTo(Response, 'id').query({where: {state: 1}});
  }
});

export default {
  Question: Question,
  Response: Response,
  Owner: Owner,
  Contributor: Contributor
}
