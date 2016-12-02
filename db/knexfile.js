module.exports = {
  development: {
    client: 'mysql',
    connection: {
     host : '127.0.0.1',
     user : 'root',
     password : 'root',
     database : 'oq_db'
   },
   pool: {
      min: 2,
      max: 10
    }
  },
  production: {
    client: 'mysql',
    connection: {
     host : '127.0.0.1',
     user : 'root',
     password : 'root',
     database : 'oq_db'
    },
    pool: {
      min: 2,
      max: 10
    },
    ssl: true
  }
}