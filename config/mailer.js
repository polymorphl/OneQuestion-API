import pug from 'pug';

const env = process.env.NODE_ENV || 'development';

const conf = require('./mailer_config');

const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport(conf[env]);


async function sendEmail(from, to, subject, context, cb) {

  const myTemplate = pug.compileFile('./config/emails/pug/welcome.pug');
  let opt = {
    from: from,
    to: to,
    subject: subject,
    text: 'test Email',
    html: myTemplate({data: context})
  };

  await transport.sendMail(opt, function(err, info) {
    if (err) {
      return console.log(err);
    }
    return cb(0, info);
  });
}

export default sendEmail;
