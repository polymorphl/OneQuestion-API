import database from '../db/';


/*
  # Table: question
  Id,
  ownerId,
  contributorId,
  question
*/
var Question = database.Model.extend({
  tableName: 'question',
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
  questionId
*/
var Response = database.Model.extend({
tableName: 'response',
question: function() {
  return this.belongsTo(Question);
}
});


/*
  # Table: owner
  Id,
  Shortcode
*/
var Owner = database.Model.extend({
  tableName: 'owner',
  question: function() {
    return this.belongsTo(Question);
  }
});


/*
  # Table: contributor
  Id,
  ownerId
  shortcode
*/
var Contributor = database.Model.extend({
  tableName: 'contributor',
  owner: function() {
    return this.belongsTo(Owner);
  }
});

export default {
  Question,
  Response,
  Owner,
  Contributor
}
