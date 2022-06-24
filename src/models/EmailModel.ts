import mongoose, {Model, Schema, IDocument} from '../modules/mongoose';
import {ThrowHttpError} from '../modules/error';
import {HttpErrorCodes, HttpErrorMessages} from '../modules/error';
import {SendSettingModel, ISendSettingDocument} from './index';

export const ModelName = 'emails';

interface IEmail {
  _id: string;
  ip: string;
  uid: string;
  email: string;
  code: string;
  type: string;
  verified: boolean;
  toc: Date;
  tlv: Date;
}

export interface IEmailDocument extends IEmail, IDocument<string> {}

export interface IEmailModel extends Model<IEmailDocument> {
  ensureSendPermissionForCount: (email: string) => Promise<void>;
  ensureSendPermissionForIp: (ip: string) => Promise<void>;
  VerifySendPermission: (options: object) => Promise<boolean>;
}

const EmailSchema = new Schema<IEmailDocument>({
  _id: String,
  ip: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
    index: 1,
  },
  email: {
    type: String,
    required: true,
    index: 1,
  },
  code: {
    type: String,
    required: true,
    index: 1,
  },
  type: {
    type: String,
    required: true,
    index: 1,
  },
  verified: {
    type: Boolean,
    default: false,
    index: 1,
  },
  toc: {
    toc: Date,
  },
  tlv: {
    type: Date,
    index: 1,
  },
});

/*
 * 通过uid获取指定发送过的邮件
 * */
EmailSchema.statics.findByUid = function (
  uid: string,
): Promise<IEmailDocument> {
  return this.findOne({uid});
};

/*
 * 验证邮箱发送权限
 * */
EmailSchema.statics.ensureSendPermissionForCount = async function (
  email: string,
) {
  const setting = await SendSettingModel.findOne({_id: 1});
  if (setting === null) {
    ThrowHttpError(
      HttpErrorCodes.ServiceUnavailable,
      HttpErrorMessages.ERR_SETTING_LOST,
    );
  }
  const {sendEmailCount} = setting as ISendSettingDocument;
  const emails = await EmailModel.find({
    email,
    toc: {$gt: Date.now() - 24 * 60 * 60 * 1000},
  });
  if (emails.length >= sendEmailCount) {
    return ThrowHttpError(
      HttpErrorCodes.UnAuthorized,
      HttpErrorMessages.ERR_USED_EMAIL,
    );
  }
};

/*
 * 验证同一IP的发送权限
 * */
EmailSchema.statics.ensureSendPermissionForIp = async function (ip: string) {
  const EmailModel = mongoose.model('emails');
  const setting = await SendSettingModel.findOne({_id: 1});
  const {sameIpSendEmailCount} = setting as ISendSettingDocument;
  const emails = await EmailModel.find({
    ip,
    toc: {$gt: Date.now() - 24 * 60 * 60 * 1000},
  });
  if (emails.length >= sameIpSendEmailCount) {
    return ThrowHttpError(
      HttpErrorCodes.UnAuthorized,
      HttpErrorMessages.ERR_USED_EMAIL,
    );
  }
};

/*
 * 验证用户邮箱的发表权限
 * */
EmailSchema.statics.VerifySendPermission = async function (options: object) {
  const EmailModel = <IEmailModel>mongoose.model(ModelName);
  const {ip, uid, email, code, type} = options as IEmail;
  //验证用户给同一用户发送邮箱次数权限
  await EmailModel.ensureSendPermissionForCount(email);
  //验证同一IP发送邮箱次数权限
  await EmailModel.ensureSendPermissionForIp(ip);
  return true;
};

const EmailModel = mongoose.model<IEmailDocument, IEmailModel>(
  ModelName,
  EmailSchema,
);

export default EmailModel;
