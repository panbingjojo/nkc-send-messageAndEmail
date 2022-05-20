import mongoose, {Model, Schema, IDocument} from '../modules/mongoose';
import {ISettingDocument} from './SettingModel';
import {ThrowHttpError} from '../modules/error';
import {HttpErrorMessages, HttpErrorCodes} from '../modules/error';
import {SettingModel, MessageModel} from './index';

export const ModelName = 'messages';

interface IMessage {
  uid: string;
  type: string;
  nationCode: string;
  mobile: string;
  ip: string;
  toc: Date;
  tlv: Date;
}

export interface IMessageDocument extends IMessage, IDocument<string> {}

export interface IMessageModel extends Model<IMessageDocument> {
  ensureSendPermissionForCount: (options: object) => Promise<void>;
  ensureSendPermissionForIp: (options: object) => Promise<void>;
  verifySendPermission: (options: object) => Promise<boolean>;
}

const MessageSchema = new Schema<IMessageDocument>({
  uid: {
    type: String,
    required: true,
    index: 1,
  },
  type: {
    type: String,
    required: true,
    index: 1,
  },
  nationCode: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    index: 1,
  },
  ip: {
    type: String,
    required: true,
    index: 1,
  },
  toc: {
    type: Date,
    required: true,
    index: 1,
  },
  tlv: {
    type: Date,
    required: true,
    index: 1,
  },
});

/*
 * 验证用户一天对同一手机号发送消息次数权限
 * */
MessageSchema.statics.ensureSendPermissionForCount = async function (
  options: object,
) {
  const {uid, mobile} = options as {uid: string; mobile: string};
  const setting = await SettingModel.findOne();
  const {sendMobileCodeCount} = setting as ISettingDocument;
  const messages = await MessageModel.find({uid, mobile});
  if (messages.length >= sendMobileCodeCount) {
    return ThrowHttpError(
      HttpErrorCodes.UnAuthorized,
      HttpErrorMessages.ERR_USED_MOBILE,
    );
  }
};

/*
 * 验证同一IP的发送权限
 * */
MessageSchema.statics.ensureSendPermissionForCount = async function (
  options: object,
) {
  const {ip} = options as {ip: string};
  const setting = await SettingModel.findOne();
  const {sendMobileCodeCountSameIp} = setting as ISettingDocument;
  const messages = await MessageModel.find({ip});
  if (messages.length >= sendMobileCodeCountSameIp) {
    return ThrowHttpError(
      HttpErrorCodes.UnAuthorized,
      HttpErrorMessages.ERR_USED_MOBILE,
    );
  }
};

/*
 * 验证用户是否具有发送消息的权限
 * */
MessageSchema.statics.verifySendPermission = async function (options: object) {
  const {ip, uid, type, mobile, nationCode} = options as IMessage;
  await MessageModel.ensureSendPermissionForCount({uid, mobile});
  await MessageModel.ensureSendPermissionForIp({uid, ip});
  return true;
};

export default mongoose.model<IMessageDocument, IMessageModel>(
  ModelName,
  MessageSchema,
);
