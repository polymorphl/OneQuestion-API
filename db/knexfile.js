module.exports = {
  development: {
    client: 'mysql',
    connection: {
     host : '127.0.0.1',
     user : 'root',
     password : 'root',
     database : 'OQ_DB'
   }
  },
  production: {
    client: 'mysql',
    connection: connection: {
     host : '127.0.0.1',
     user : 'root',
     password : 'root',
     database : 'OQ_DB'
    },
    ssl: true
  }
}
