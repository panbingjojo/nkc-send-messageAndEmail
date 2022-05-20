import {Context} from 'moleculer';
import {string} from 'yaml/dist/schema/common/string';
import {sendMessage} from '../../modules/sendMessage';
import {MessageModel} from '../../models';
import {MessageBaseInfo} from '../../interfaces/message';

export default {
  params: {
    uid: string,
    type: string,
    nationCode: string,
    mobile: string,
    ip: string,
  },
  async handler(ctx: Context) {
    const params = <MessageBaseInfo>ctx.params;
    const {uid, type, nationCode, mobile, ip} = params;
    //验证用户的短信发送权限
    const sendPermission = await MessageModel.verifySendPermission(params);
    if (sendPermission) {
      await sendMessage({
        nationCode,
        uid,
        mobile,
        type,
        ip,
      });
    }
  },
};
