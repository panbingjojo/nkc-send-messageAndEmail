import {SettingBaseInfo} from '../../interfaces/setting';
import SendSettingModel, {
  ISendSettingDocument,
} from '../../models/SendSettingModel';
export async function CreateSetting(
  settingBaseInfo: SettingBaseInfo,
): Promise<ISendSettingDocument> {
  const {} = settingBaseInfo;
  const setting = new SendSettingModel({});
  await setting.save();
  return setting;
}
