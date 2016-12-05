import file from './knexfile';

const env = process.env.NODE_ENV || 'development';

const knex = require('knex')(file[env]);

const bookshelf = require('bookshelf')(knex);

bookshelf.plugin('virtuals');

export default bookshelf;
