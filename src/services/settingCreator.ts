import {SendSettingModel} from '../models';
import {Config} from '../interfaces/config';
import emailConfig from '../config/emailConfig';
import messageConfig from '../config/messageConfig';
import {InfoLog, ErrorLog} from '../modules/logger';
import {yamlToJson} from '../modules/yaml';
import {readFileSync} from 'fs';
import {resolve} from 'path';
const configFilePath = resolve(__dirname, '../../configs.yaml');
const yamlContent = readFileSync(configFilePath).toString();
const configs = <Config>yamlToJson(yamlContent);

export const setNormalSetting = async () => {
  const setting = await SendSettingModel.findOne();
  if (!setting) {
    InfoLog('开始设置默认值...');
    const {
      mobileCodeTime,
      emailCodeTime,
      sendEmailCount,
      sameIpSendEmailCount,
      sendMobileCodeCount,
      sendMobileCodeCountSameIp,
    } = configs;
    const normalSetting = new SendSettingModel({
      mobileCodeTime,
      emailCodeTime,
      sendEmailCount,
      sameIpSendEmailCount,
      sendMobileCodeCount,
      sendMobileCodeCountSameIp,
      emailConfig,
      messageConfig,
    });
    await normalSetting.save();
    InfoLog('设置成功！');
    return normalSetting;
  }
};

//获取后台设置
export const getSettings = async () => {
  const setting = await SendSettingModel.findOne();
  if (!setting) return ErrorLog;
  return setting;
};
