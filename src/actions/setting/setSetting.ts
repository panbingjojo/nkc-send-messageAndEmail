import {Context} from 'moleculer';
import {ISettingDocument, SettingModel} from '../../models';

export default {
  params: {
    mobileCodeTime: 'number',
    emailCodeTime: 'number',
    sendEmailCount: 'number',
    sameIpSendEmailCount: 'number',
    sendMobileCodeCount: 'number',
    sendMobileCodeCountSameIp: 'number',
  },
  async handler(ctx: Context) {
    const params = <ISettingDocument>ctx.params;
    await SettingModel.setSetting(params);
  },
};
