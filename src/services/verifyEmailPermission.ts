import {
  MessageModel,
  EmailModel,
  IMessageDocument,
  SettingModel,
  ISettingDocument,
  IEmailDocument,
} from '../models';
import {
  HttpErrorCodes,
  HttpErrorMessages,
  ThrowHttpError,
} from '../modules/error';

export async function ensureSendPermissionForCount(options: IEmailDocument) {
  const {uid, email} = options;
  const setting = await SettingModel.findOne();
  if (setting === null) {
    return ThrowHttpError(
      HttpErrorCodes.ServiceUnavailable,
      HttpErrorMessages.ERR_SETTING_LOST,
    );
  }
  const {sendEmailCount} = setting as ISettingDocument;
  const emails = await EmailModel.find({
    email,
    uid,
    toc: {$gt: Date.now() - 24 * 60 * 60 * 1000},
  });
  if (emails.length >= sendEmailCount) {
    return ThrowHttpError(
      HttpErrorCodes.UnAuthorized,
      HttpErrorMessages.ERR_USED_EMAIL,
    );
  }
}

export async function ensureSendPermissionForIp(options: IEmailDocument) {
  const {ip} = options;
  const setting = await SettingModel.findOne();
  if (setting === null) {
    return ThrowHttpError(
      HttpErrorCodes.ServiceUnavailable,
      HttpErrorMessages.ERR_SETTING_LOST,
    );
  }
  const {sameIpSendEmailCount} = setting as ISettingDocument;
  const emails = await EmailModel.find({
    ip,
    toc: {$gt: Date.now() - 24 * 60 * 60 * 1000},
  });
  if (emails.length >= sameIpSendEmailCount) {
    return ThrowHttpError(
      HttpErrorCodes.ServiceUnavailable,
      HttpErrorMessages.ERR_SETTING_LOST,
    );
  }
}

export async function VerifySendPermission(options: IEmailDocument) {
  await ensureSendPermissionForCount(options);
  await ensureSendPermissionForIp(options);
  return true;
}
