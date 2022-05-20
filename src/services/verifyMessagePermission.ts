import {
  MessageModel,
  IMessageDocument,
  SettingModel,
  ISettingDocument,
} from '../models';
import {
  HttpErrorCodes,
  HttpErrorMessages,
  ThrowHttpError,
} from '../modules/error';

export async function ensureSendPermissionForCount(options: IMessageDocument) {
  const {uid, mobile} = options;
  const setting = await SettingModel.findOne();
  if (setting === null) {
    return ThrowHttpError(
      HttpErrorCodes.ServiceUnavailable,
      HttpErrorMessages.ERR_SETTING_LOST,
    );
  }
  const {sendEmailCount} = setting as ISettingDocument;
  const messages = await MessageModel.find({
    uid,
    mobile,
    toc: {$gt: Date.now() - 24 * 60 * 60 * 1000},
  });
  if (messages.length >= sendEmailCount) {
    return ThrowHttpError(
      HttpErrorCodes.UnAuthorized,
      HttpErrorMessages.ERR_USED_MOBILE,
    );
  }
}

export async function ensureSendPermissionForIp(options: IMessageDocument) {
  const {ip} = options;
  const setting = await SettingModel.findOne();
  if (setting === null) {
    return ThrowHttpError(
      HttpErrorCodes.ServiceUnavailable,
      HttpErrorMessages.ERR_SETTING_LOST,
    );
  }
  const {sendMobileCodeCountSameIp} = setting as ISettingDocument;
  const messages = await MessageModel.find({ip});
  if (messages.length >= sendMobileCodeCountSameIp) {
    return ThrowHttpError(
      HttpErrorCodes.UnAuthorized,
      HttpErrorMessages.ERR_USED_MOBILE,
    );
  }
}

export async function verifySendPermission(options: IMessageDocument) {
  await ensureSendPermissionForCount(options);
  await ensureSendPermissionForIp(options);
  return true;
}
