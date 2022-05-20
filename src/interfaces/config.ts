export interface Config {
  tokenSecret: string;
  tokenExpiresIn: string;
  mobileCodeTime: number;
  emailCodeTime: number;
  sendEmailCount: number;
  sameIpSendEmailCount: number;
  sendMobileCodeCount: number;
  sendMobileCodeCountSameIp: number;
}
