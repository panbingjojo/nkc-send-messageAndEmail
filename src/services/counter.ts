import {SettingModel, EmailModel, MessageModel} from '../models';
import {
  HttpErrorCodes,
  HttpErrorMessages,
  ThrowHttpError,
} from '../modules/error';

/*
 * 获取新 ID
 * @param {String} modelName 集合名
 * @param {Number} inc 增加的值
 * */
export async function GetNewId(modelName: string, inc = 1) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (![EmailModel, MessageModel].includes(modelName)) {
    ThrowHttpError(
      HttpErrorCodes.InternalServerError,
      HttpErrorMessages.ERR_INVALID_DB_MODEL_NAME,
    );
  }
  const updateBody: {$inc: {[propName: string]: number}} = {
    $inc: {},
  };
  updateBody.$inc[`counter.${modelName}`] = inc;
  const setting = await SettingModel.findOneAndUpdate({}, updateBody);
  return (
    (setting as {counter: {[propName: string]: number}}).counter[modelName] + 1
  );
}
