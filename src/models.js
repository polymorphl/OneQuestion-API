import database from '../db/index';


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
  owner: function() {
    return this.hasOne(Owner);
  },
  contributor: function() {
    return this.hasOne(Contributor);
  },
  responses: function() {
    return this.hasMany(Response);
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
  contributor: function() {
    return this.belongsTo(Contributor, 'contributor_shortcode');
  },
  question: function() {
    return this.belongsTo(Question, 'id');
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
  idAttribute: 'owner_shortcode',
  question: function() {
    return this.belongsTo(Question, 'id');
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
  idAttribute: 'contributor_shortcode',
  response: function() {
    return this.belongsTo(Response, 'id');
  }
});

export default {
  Question: Question,
  Response: Response,
  Owner: Owner,
  Contributor: Contributor
}
