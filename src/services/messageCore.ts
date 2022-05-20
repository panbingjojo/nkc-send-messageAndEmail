import QCloudSms from 'qcloudsms_js';

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
module.exports = async (smsSettings: object, obj: object) => {
  const {templateId, timeout, content, mobile, nationCode, description} =
    obj as {
      templateId: string;
      timeout: string;
      content: string;
      mobile: number;
      nationCode: string;
      description: string;
    };
  const {appId, appKey, smsSign} = smsSettings as {
    appId: string;
    appKey: string;
    smsSign: string;
  };

  const sSender<any> = QCloudSms(appId, appKey).SmsSingleSender();
  return new Promise((resolve, reject) => {
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
  });
};
