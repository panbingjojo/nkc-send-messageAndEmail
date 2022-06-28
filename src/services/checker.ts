import {
  HttpErrorCodes,
  HttpErrorMessages,
  ThrowHttpError,
} from '../modules/error';

export async function checkerCode(code = '') {
  code = code.toLowerCase();
  if (!code)
    ThrowHttpError(HttpErrorCodes.BadRequest, HttpErrorMessages.ERR_NO_CODE);
  //检测动态码是否正常

}
