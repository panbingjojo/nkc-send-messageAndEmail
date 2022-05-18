const tencentCloud = require('./messageCore');

export const sendMessage = async (obj: any) => {
  // if(global.NKc.NODE_ENV) return console.log(obj);
  const SettingModel = require('../models/SettingModel');
  const smsSettings = await SettingModel.findOne({_id: 'sms'});
  const {type, nationCode}: any = obj;
  const {templates} = smsSettings;
  let templateId, timeout, content;
  for(const template of templates) {
    if(template.name === type) {
      templateId = template.id;
      for(const o of template.oid) {
        const {nationCode: oNationCode, id}: any = o;
        if(nationCode === oNationCode) {
          templateId = id;
          break;
        }
      }
      timeout = template.validityPeriod;
      content = template.content;
      break;
    }
  }
  if(templateId === undefined) throw `${type}模板未定义`;
  content = content.replace(/{code}/g, obj.code).replace(/{time}/g, timeout);
  obj = Object.assign({}, obj, {templateId, timeout, content});
  return tencentCloud(smsSettings, obj);
};
