const QCloudSms = require('qcloudsms_js');
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
module.exports = async (smsSettings: any, obj: any) => {
  const {templateId, timeout, content, mobile, nationCode, description}: any = obj;
  const {appId, appKey, smsSign}: any = smsSettings;

  const qCloudSms = QCloudSms(appId, appKey);
  const sSender = qCloudSms.SmsSingleSender();
  return new Promise((resolve, reject) => {
    const callback = (err: any, res: any, resData: any) => {
      if(err) {
        reject(err);
      } else {
        const {result, errmsg}: any = resData;
        if(result !== 0) {
          reject(new Error(`发送消息失败, 错误码：${result}, 错误信息: "${errmsg}"`));
        } else {
          resolve(resData);
        }
      }
    }
    const params = [content];
    sSender.sendWithParam(nationCode?parseInt(nationCode):86, mobile, templateId, params, smsSign, "", "", callback);
  })
};
