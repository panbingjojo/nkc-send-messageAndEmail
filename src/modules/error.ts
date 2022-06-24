import Moleculer from 'moleculer';
import MoleculerError = Moleculer.Errors.MoleculerError;

export const HttpErrorCodes = {
  OK: 200,
  MovedPermanently: 301,
  BadRequest: 400,
  UnAuthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  InternalServerError: 500,
  BadGateway: 502,
  ServiceUnavailable: 503,
};

export const HttpErrorMessages = {
  ERR_INVALID_USERNAME: 'ERR_INVALID_USERNAME ',
  ERR_INVALID_UID: 'ERR_INVALID_UID ',
  ERR_USED_USERNAME: 'ERR_USED_USERNAME',
  ERR_INVALID_EMAIL: 'ERR_INVALID_EMAIL',
  ERR_INVALID_MOBILE: 'ERR_INVALID_MOBILE',
  ERR_USED_EMAIL: 'ERR_USED_EMAIL',
  ERR_USED_MOBILE: 'ERR_USED_MOBILE',
  ERR_SETTING_LOST: 'ERR_SETTING_LOST',
  ERR_NO_CODE: 'ERR_NO_CODE',
  ERR_INVALID_DB_MODEL_NAME: 'ERR_INVALID_DB_MODEL_NAME',
};

export function ThrowHttpError(code: number, message: string): MoleculerError {
  throw new MoleculerError(message, code);
}
