import {Context} from 'moleculer';
import {string} from 'yaml/dist/schema/common/string';
import {EmailBaseInfo} from '../../controllers/email/interfaces';
import {EmailModel} from '../../models';
import {sendEmail} from '../../modules/sendEmail';

export default {
  params: {
    uid: string,
    ip: string,
    email: string,
    code: string,
    type: string,
  },
  async handler(ctx: Context) {
    const params = <EmailBaseInfo>ctx.params;
    const {uid, ip, email, code, type} = params;
    //验证动态码
    //验证是否能发送邮件
    const sendPermission = await EmailModel.VerifySendPermission(params);
    //如果具有发送邮件的权限就发送邮件
    if (sendPermission) {
      await sendEmail({
        email,
        code,
        type,
      });
    }
  },
};
