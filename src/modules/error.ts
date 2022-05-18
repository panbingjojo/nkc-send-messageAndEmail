export const ErrorCodes = {
  OK: 200,
  MovedPermanently: 301,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  InternalServerError: 500,
  BadGateway: 502,
  ServiceUnavailable: 503,
};

export const ErrorTypes = {
  NotFindUser: '未找到指定用户信息，可能是提供的查询信息有误。',
};

export function ThrowError(code: number, message: string): Error {
  throw new Error(message);
}
