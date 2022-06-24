import {Context} from 'moleculer';
import {IEmailDocument} from '../../models';
import {sendEmail} from '../../services/sendEmail';
import {verifySendPermission} from '../../services/verifyEmailPermission';

export default {
  params: {
    uid: 'string',
    ip: 'string',
    email: 'string',
    code: 'string',
    type: 'string',
  },
  async handler(ctx: Context) {
    const params = <IEmailDocument>ctx.params;
    //验证动态码
    //验证邮件发送权限
    const sendPermission = await verifySendPermission(params);
    //如果具有发送邮件的权限就发送邮件
    if (sendPermission) {
      await sendEmail(params);
    }
  },
};
