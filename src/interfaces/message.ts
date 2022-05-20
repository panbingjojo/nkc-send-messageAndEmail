export interface EmailOptions {
  to: any;
  from: any;
  subject?: any;
  html?: any;
}

export interface MessageBaseInfo {
  _id: string;
  uid: string;
  type: string;
  mobile: string;
  ip: string;
  nationCode: string;
  toc: string;
  tlv: string;
}
