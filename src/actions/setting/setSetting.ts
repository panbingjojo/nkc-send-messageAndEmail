import {Context} from 'moleculer';
import {ISendSettingDocument, SendSettingModel} from '../../models';

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
    const params = <ISendSettingDocument>ctx.params;
    await SendSettingModel.setSetting(params);
  },
};
