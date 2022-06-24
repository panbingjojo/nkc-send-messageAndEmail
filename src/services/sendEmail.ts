import nm from 'nodemailer';
import {EmailOptions} from '../interfaces/message';
import {
  SendSettingModel,
  EmailModel,
  ISendSettingDocument,
  EmailModelName,
} from '../models';
import {IEmailConfig} from '../models/SendSettingModel';
import {ISmtpConfig, ITemplate} from '../config/emailConfig';
import {GetNewId} from './counter';
import {
  HttpErrorMessages,
  HttpErrorCodes,
  ThrowHttpError,
} from '../modules/error';

interface IOption {
  email: string;
  type: string;
  code: string;
  uid: string;
  ip: string;
}

interface IEmailSetting {
  smtpConfig: string;
  from: string;
  templates: string;
}

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
  const {email, type, code, uid, ip} = options as IOption;
  const emailId = await GetNewId(EmailModelName);
  //保存发送记录
  const sendEmailRecode = new EmailModel({
    _id: emailId,
    ip,
    uid,
    email,
    code,
    type,
    toc: new Date(),
  });
  await sendEmailRecode.save();
  if (!email)
    ThrowHttpError(HttpErrorCodes.BadRequest, HttpErrorMessages.ERR_USED_EMAIL);
  const setting = await SendSettingModel.findOne();
  const {emailConfig} = setting as ISendSettingDocument;
  const {smtpConfig, from, templates} = <IEmailConfig>emailConfig;
  const emailOptions: EmailOptions = {
    to: email,
    from,
  };
  const config = smtpConfig as ISmtpConfig;
  const {secure} = <ISmtpConfig>smtpConfig;
  if (secure) config.port = 465;
  const template = templates.filter((t: object) => {
    const {name} = t as ITemplate;
    return name === type;
  });
  if (template.length === 0) throw '未知的模板类型';
  const t = template[0];
  const {title, text} = t as ITemplate;
  emailOptions.subject = title;
  emailOptions.html = text + `<h2>${code}</h2>`;
  const transporter = nm.createTransport(config);
  return new Promise((resolve, reject) => {
    transporter.sendMail(emailOptions, (error: any, info: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};
