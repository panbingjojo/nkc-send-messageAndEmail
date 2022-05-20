import {SettingBaseInfo} from '../../interfaces/setting';
import SettingModel, {ISettingDocument} from '../../models/SettingModel';
export async function CreateSetting(
  settingBaseInfo: SettingBaseInfo,
): Promise<ISettingDocument> {
  const {} = settingBaseInfo;
  const setting = new SettingModel({
  });
  await setting.save();
  return setting;
}
