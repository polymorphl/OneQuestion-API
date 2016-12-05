const env = process.env.NODE_ENV || 'development';

const conf = require('./mailer_config');

const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport(conf[env]);

async function sendEmail(from, to, subject, context, cb) {
  let opt = {
    from: from,
    to: to,
    subject: subject,
    text: 'test Email',
    html: '<b>test Email</b>'
  };

  await transport.sendMail(opt, function(err, info) {
    if (err) {
      return console.log(err);
    }
    return cb(0, info);
  });
}

export default sendEmail;
