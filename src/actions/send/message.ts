import {Context} from 'moleculer';
import {sendMessage} from '../../services/sendMessage';
import {IMessageDocument} from '../../models';
import {verifySendPermission} from '../../services/verifyMessagePermission';

export default {
  params: {
    uid: 'string',
    type: 'string',
    nationCode: 'string',
    mobile: 'string',
    ip: 'string',
  },
  async handler(ctx: Context) {
    const params = ctx.params as IMessageDocument;
    const {uid, type, nationCode, mobile, ip} = params;
    //验证用户的短信发送权限
    const sendPermission = await verifySendPermission(params);
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
