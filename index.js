'use strict';

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;
const src = env === 'production' ? './build/app' : './src/app';

require('babel-polyfill');
if (env === 'development') {
  // for development use babel/register for faster runtime compilation
  require('babel-register');
}

const app = require(src).default;
const fs = require('fs');

var http = require('http');
var https = require('https');

// SSL options
var options = {
  key: fs.readFileSync('./config/certs/local/key.pem'),
  cert: fs.readFileSync('./config/certs/local/cert.pem')
}

// start the http server
http.createServer(app.callback()).listen(port, () => {
  console.log(`HTTP Server is ready at http://127.0.0.1:${port}`)
});
// start the https server
// https.createServer(options, app.callback()).listen(443, () => {
//   console.log(`HTTPS Server is ready at http://127.0.0.1:443`)
// });
