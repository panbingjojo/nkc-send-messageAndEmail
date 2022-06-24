import QCloudSms from 'qcloudsms_js';
import {MessageModel, IMessageDocument, MessageModelName} from '../models';
import {GetNewId} from './counter';
import Message from "../actions/send/message";

/*
 * 发送短信
 * @params {object} options
 *   templateId {string} 模板ID
 *   timeout {number} 超时时间
 *   content {string} 短信内容
 *   mobile {number} 手机号
 *   nationCode {number}
 *   description {string} 描述
 * */
export const tencentCloud = async (smsSettings: object, obj: object) => {
  const {mobile, nationCode, uid, ip, type} = obj as IMessageDocument;
  const {templateId, content} = obj as {
    templateId: string;
    content: string;
  };
  const {appId, appKey, smsSign} = smsSettings as {
    appId: string;
    appKey: string;
    smsSign: string;
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  const sSender = QCloudSms(appId, appKey).SmsSingleSender();
  return new Promise(async (resolve, reject) => {
    const callback = (err: any, res: any, resData: any) => {
      if (err) {
        reject(err);
      } else {
        const {result, errmsg} = resData as {
          result: number;
          errmsg: string;
        };
        if (result !== 0) {
          reject(
            new Error(`发送消息失败, 错误码：${result}, 错误信息: "${errmsg}"`),
          );
        } else {
          resolve(resData);
        }
      }
    };
    const params = [content];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    sSender.sendWithParam(
      nationCode ? parseInt(nationCode) : 86,
      mobile,
      templateId,
      params,
      smsSign,
      '',
      '',
      callback,
    );
    //创建消息发送记录
    const messageId = await GetNewId(MessageModelName);
    const newMessageRecord = new MessageModel({
      _id: messageId,
      uid,
      type,
      nationCode,
      mobile,
      ip,
      toc: new Date(),
    });
    await newMessageRecord.save();
  });
};
