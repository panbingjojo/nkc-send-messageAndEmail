import {Context, ServiceSchema} from 'moleculer';
import {EmailBaseInfo} from './interfaces';
import {CreateEmail} from './service';
import {string} from 'yaml/dist/schema/common/string';
import {sendEmail} from '../../modules/sendEmail';

export default <ServiceSchema>{
  name: 'message',
  version: 1,
  actions: {
    //发送消息
    sendEmail: {
      params: {
        email: string,
        code: string,
        type: string,
      },
      async handler(ctx: Context) {
        const params = <EmailBaseInfo>ctx.params;
        //创建一条新的邮件发送记录
        await CreateEmail(params);
        //发送消息
        return sendEmail({
          email: params.email,
          code: params.code,
          type: params.type,
        });
      },
    },
    //验证消息发送权限
    verifySendPermission: {
      params: {
        uid: string,
        ip: string,
        email: string,
        code: string,
        type: string,
      },
    },
  },
};
