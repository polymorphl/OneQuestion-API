import pug from 'pug';
import fs from 'fs';

const env = process.env.NODE_ENV || 'development';

const conf = require('./mailer_config');

const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport(conf[env]);


async function sendEmail(from, to, subject, context, cb) {

  let tpl = "";
  //manage templateFile
  if (context.templateFile) {
    tpl = context.templateFile;
  } else {
    cb(1, 'NO TPL')
  }

  // prepare email model
  const myTemplate = pug.compileFile(`./config/emails/pug/${tpl}.pug`);
  let opt = {
    from: from,
    to: to,
    subject: subject,
    html: myTemplate({data: context}) //instance the model with given context
  };

  await transport.sendMail(opt, function(err, info) {
    if (err) {
      return console.error(err);
    }
    return cb(0, info);
  });
}

export default sendEmail;
