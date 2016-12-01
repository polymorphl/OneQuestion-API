import bookshelf from 'bookshelf';
import knex from './';

const db = bookshelf(knex);

db.Model = ModelBase(db).extend()

export default db;
