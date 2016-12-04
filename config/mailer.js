const env = process.env.NODE_ENV || 'development';

const conf = require('./mailer_config');

const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport(conf[env]);

function sendEmail(from, to, subject, context, cb) {
  let opt = {
    from: from,
    to: to,
    subject: subject,
    text: 'test Email',
    html: '<b>test Email</b>'
  };

  transport.sendMail(opt, function(err, info) {
    if (err) {
      return console.log(err);
    }
    console.log('Email send: ' + info.response);
    cb(0, info);
  });
}

module.exports = sendEmail;
