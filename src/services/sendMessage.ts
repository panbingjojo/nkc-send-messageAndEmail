import {tencentCloud} from './messageCore';
import {SendSettingModel} from '../models';
import {ISendSetting, IMessageConfig} from '../models/SendSettingModel';

interface ITemplate {
  id: string;
  name: string;
  oid: [];
  validityPeriod: number | string;
  content: string;
  templates: [];
  sameIpOneDay: number;
  sameMobileOneDay: number;
}

interface IObj {
  type: string;
  nationCode: string;
  code: string;
  content: string;
  timeout: number;
  uid: string;
  mobile: string;
  ip: string;
}

export const sendMessage = async (obj: object) => {
  const smsSetting = (await SendSettingModel.findOne()) || {};
  const {type, nationCode, code} = obj as IObj;
  const {messageConfig} = smsSetting as ISendSetting;
  const {templates} = messageConfig as IMessageConfig;
  let templateId: string | undefined = undefined;
  const timeout: number | undefined = undefined;
  let content: string;
  if (templates) {
    for (const template of templates) {
      const {name, id, oid, validityPeriod, content: c} = template as ITemplate;
      if (name === type) {
        templateId = id;
        for (const o of oid) {
          const {nationCode: oNationCode, id} = o as {
            nationCode: string;
            id: string;
          };
          if (nationCode === oNationCode) {
            templateId = id;
            break;
          }
        }
        content = c;
        content = content
          .replace(/{code}/g, code)
          .replace(
            /{time}/g,
            typeof validityPeriod === 'string' ? validityPeriod : '',
          );
        obj = Object.assign({}, obj, {templateId, timeout, content});
        break;
      }
    }
  }
  if (templateId === undefined) throw `${type}模板未定义`;
  return tencentCloud(smsSetting, obj);
};
