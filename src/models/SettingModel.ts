import {yamlToJson} from '../modules/yaml';
import {Config} from '../interfaces/config';
import mongoose, {Model, Schema, IDocument} from '../modules/mongoose';
import {IEmailModel} from './EmailModel';
import {resolve} from 'path';
import {readFileSync} from 'fs';
const configFilePath = resolve();
const yamlContent = readFileSync(configFilePath).toString();

export const ModelName = 'settings';

const configs = <Config>yamlToJson(yamlContent);

interface ITemplate {
  id: string;
  name: string;
  oid: string[];
  validityPeriod: number;
  content: string;
}

interface ISetting {
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
  //消息模板
  templates: object[];
}

export interface ISettingDocument extends ISetting, IDocument<string> {}

export interface ISettingModel extends Model<ISettingDocument> {
  setSetting: (options: object) => Promise<ISetting>;
}

const SettingSchema = new Schema<ISettingDocument>({
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
  templates: {
    type: [String],
    default: [],
  },
});

SettingSchema.statics.findById = function (
  _id: string,
): Promise<ISettingDocument> {
  return this.findOne({_id});
};

//更改消息发送设置
SettingSchema.statics.setSetting = async function (options: object) {
  const SettingModel = mongoose.model(ModelName) as ISettingModel;
  const {
    mobileCodeTime,
    emailCodeTime,
    sendEmailCount,
    sameIpSendEmailCount,
    sendMobileCodeCount,
    sendMobileCodeCountSameIp,
  } = options as ISetting;
  const setting = await SettingModel.findOne();
  if (setting) {
    await setting.updateOne({
      mobileCodeTime,
      emailCodeTime,
      sendEmailCount,
      sameIpSendEmailCount,
      sendMobileCodeCount,
      sendMobileCodeCountSameIp,
    });
  }
};

SettingSchema.statics.setNormalSetting = async function () {
  const SettingModel = mongoose.model(ModelName) as ISettingModel;
  const setting = await SettingModel.findOne();
  const {
    mobileCodeTime,
    emailCodeTime,
    sendEmailCount,
    sameIpSendEmailCount,
    sendMobileCodeCount,
    sendMobileCodeCountSameIp,
  } = configs;
  if (setting) {
    const set = new SettingModel({
      mobileCodeTime,
      emailCodeTime,
      sendEmailCount,
      sameIpSendEmailCount,
      sendMobileCodeCount,
      sendMobileCodeCountSameIp,
    });
    await set.save();
    return set;
  }
};

export default mongoose.model<ISettingDocument, ISettingModel>(
  ModelName,
  SettingSchema,
);
