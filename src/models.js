import database from '../db/index';


/*
  # Table: question
  Id,
  ownerId,
  contributorId,
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
  contributorId,
  questionId,
  response,
  timestamp X2
*/
var Response = database.Model.extend({
tableName: 'responses',
  question: function() {
    return this.belongsTo(Question, 'id');
  }
});


/*
  # Table: owner
  Id,
  owner_id,
  email,
  firstname,
  Shortcode,
  timestamp X2
*/
var Owner = database.Model.extend({
  tableName: 'owners',
  idAttribute: 'owner_id',
  question: function() {
    return this.belongsTo(Question, 'id');
  }
});


/*
  # Table: contributor
  Id,
  contributor_id,
  email,
  firstname,
  shortcode,
  timestamp X2
*/
var Contributor = database.Model.extend({
  tableName: 'contributors',
  idAttribute: 'contributor_id',
  owner: function() {
    return this.belongsTo(Owner, 'contributor_id');
  }
});

export default {
  Question: Question,
  Response: Response,
  Owner: Owner,
  Contributor: Contributor
}
