import {yamlToJson} from '../modules/yaml';
import {Config} from '../interfaces/config';
import emailConfig from '../config/emailConfig';
import messageConfig from '../config/messageConfig';
import mongoose, {Model, Schema, IDocument} from '../modules/mongoose';
import {resolve} from 'path';
import {readFileSync} from 'fs';

const configFilePath = resolve(__dirname, '../../configs.yaml');
const yamlContent = readFileSync(configFilePath).toString();

export const ModelName = 'sendSettings';

const configs = <Config>yamlToJson(yamlContent);

export interface IEmailConfig {
  from: string;
  templates: object[];
  smtpConfig: object;
}

export interface IMessageConfig {
  status: boolean;
  platform: string;
  appId: number;
  appKey: string;
  smsSign: string;
  templates: object[];
  restrictedNumber: [];
}

export interface ISendSetting {
  // 手机验证码有效时间 15分钟
  mobileCodeTime: number;
  // 邮件激活的有效时间 一小时以内
  emailCodeTime: number;
  // 一天最多发送邮件的数量
  sendEmailCount: number;
  sameIpSendEmailCount: number;
  // 一天最多发送短信验证码数量
  sendMobileCodeCount: number;
  // 一天同一ip发送短信验证码数量
  sendMobileCodeCountSameIp: number;
  emailConfig: object;
  messageConfig: object;
}

export interface ISendSettingDocument extends ISendSetting, IDocument<string> {}

export interface ISendSettingModel extends Model<ISendSettingDocument> {
  setSetting: (options: object) => Promise<ISendSetting>;
}

const schema = new Schema<ISendSettingDocument>({
  mobileCodeTime: {
    type: Number,
    default: 15 * 60 * 1000,
  },
  emailCodeTime: {
    type: Number,
    default: 60 * 60 * 1000,
  },
  sendEmailCount: {
    type: Number,
    default: 5,
  },
  sameIpSendEmailCount: {
    type: Number,
    default: 20,
  },
  sendMobileCodeCount: {
    type: Number,
    default: 6,
  },
  sendMobileCodeCountSameIp: {
    type: Number,
    default: 10,
  },
  emailConfig: {
    type: Object,
    default: {},
  },
  messageConfig: {
    type: Object,
    default: {},
  },
});

//
// SettingSchema.statics.findById = function (
//   _id: string,
// ): Promise<ISettingDocument> {
//   return this.findOne({_id});
// };

//更改消息发送设置
schema.statics.setSetting = async function (options: object) {
  const SettingModel = mongoose.model(ModelName) as ISendSettingModel;
  const {
    mobileCodeTime,
    emailCodeTime,
    sendEmailCount,
    sameIpSendEmailCount,
    sendMobileCodeCount,
    sendMobileCodeCountSameIp,
    emailConfig,
    messageConfig,
  } = options as ISendSetting;
  const setting = await SettingModel.findOne();
  if (setting) {
    await setting.updateOne({
      mobileCodeTime,
      emailCodeTime,
      sendEmailCount,
      sameIpSendEmailCount,
      sendMobileCodeCount,
      sendMobileCodeCountSameIp,
      emailConfig,
      messageConfig,
    });
  }
};

//设置默认消息发送设置
schema.statics.setNormalSetting = async function () {
  const SettingModel = mongoose.model(ModelName) as ISendSettingModel;
  const setting = await SettingModel.findOne();
  const {
    mobileCodeTime,
    emailCodeTime,
    sendEmailCount,
    sameIpSendEmailCount,
    sendMobileCodeCount,
    sendMobileCodeCountSameIp,
  } = configs;

  if (!setting) {
    const set = new SettingModel({
      mobileCodeTime,
      emailCodeTime,
      sendEmailCount,
      sameIpSendEmailCount,
      sendMobileCodeCount,
      sendMobileCodeCountSameIp,
      emailConfig,
      messageConfig,
    });
    await set.save();
    return set;
  }
};

const SendSettingModel = mongoose.model<
  ISendSettingDocument,
  ISendSettingModel
>(ModelName, schema);

export default SendSettingModel;
