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
  tableName: 'question',
  idAttribute: 'id',
  owner: function() {
    return this.hasOne(Contributor);
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
tableName: 'response',
idAttribute: 'id',
question: function() {
  return this.belongsTo(Question, 'question_id');
}
});


/*
  # Table: owner
  Id,
  email,
  Shortcode,
  timestamp X2
*/
var Owner = database.Model.extend({
  tableName: 'owner',
  idAttribute: 'id',
  question: function() {
    return this.belongsTo(Question);
  }
});


/*
  # Table: contributor
  Id,
  ownerId,
  email,
  shortcode,
  timestamp X2
*/
var Contributor = database.Model.extend({
  tableName: 'contributor',
  idAttribute: 'id',
  owner: function() {
    return this.belongsTo(Owner);
  }
});

export default {
  Question: Question,
  Response,
  Owner,
  Contributor
}
