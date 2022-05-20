import tencentCloud from './messageCore';
import {SettingModel, ISettingDocument} from '../models';

interface ITemplate {
  id?: string;
  name?: string;
  oid?: [];
  validityPeriod?: number;
  content?: string;
  templates?: [];
}

interface IObj {
  type: string;
  nationCode: string;
  code: string;
  content: string;
  timeout: number;
}

export const sendMessage = async (obj: IObj) => {
  const smsSetting = await SettingModel.findOne();
  const {type, nationCode} = obj;
  const {templates} = smsSetting;
  let templateId: string | undefined = undefined,
    timeout: number,
    content: string,
    template: ITemplate;
  if (templates) {
    for (template of templates) {
      if (template.name === type) {
        templateId = template.id;
        for (const o of template.oid) {
          const {nationCode: oNationCode, id} = o as {
            nationCode: string;
            id: string;
          };
          if (nationCode === oNationCode) {
            templateId = id;
            break;
          }
        }
        timeout = template.validityPeriod;
        content = template.content;
        break;
      }
    }
  }

  if (templateId === undefined) throw `${type}模板未定义`;
  content = content.replace(/{code}/g, obj.code).replace(/{time}/g, timeout);
  obj = Object.assign({}, obj, {templateId, timeout, content});
  return tencentCloud(smsSettings, obj);
};
