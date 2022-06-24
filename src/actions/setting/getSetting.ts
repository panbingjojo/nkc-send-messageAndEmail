import {getSettings} from '../../services/settingCreator';

//获取服务后台设置
export default {
  params: {},
  async handler() {
    return await getSettings();
  },
};
