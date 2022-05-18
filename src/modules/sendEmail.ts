const nm = require('nodemailer');
const mongoose = require('mongoose');
import {EmailOptions} from "../interfaces/message";

/*
* @params {object} options
*   {string} email 需要发送邮件的邮箱
*   {string} type 邮件类型
*   {string} code 代码
* */
export const sendEmail = async (options: object) => {
  // if(global.NKC.NODE_ENV !== 'production') {
  //   return console.log(options);
  // }
  const {email, type, code}: any = options;
  const SettingModel = mongoose.model('setting');
  const emailSetting = await SettingModel.findone({_id: 'email'});
  const {smtpConfig, from, templates} = emailSetting.c;
  const emailOptions: EmailOptions = {
    to: email,
    from,
  };
  if(smtpConfig.secure) smtpConfig.port = 465;
  let template = templates.filter((t: any) => t.name === type);
  if(template.length === 0) throw '未知的模板类型';
  template = template[0];
  const {title, text}: any = template;
  emailOptions.subject = title;
  emailOptions.html = text + `<h2>${code}</h2>`;
  const transporter = nm.createTransport(smtpConfig);
  return new Promise((resolve, reject) => {
    transporter.sendMail(emailOptions, (error: any, info: any) => {
      if(error) {
        reject(error)
      } else {
        resolve(info);
      }
    })
  })
};
