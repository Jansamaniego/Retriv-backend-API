import config from './config';

export const accessTokenCookieOptions = {
  maxAge: config.jwt.accessExpirationMinutes * 60 * 1000,
  httpOnly: false,
  sameSite: 'lax'
};

export const refreshTokenCookieOptions = {
  maxAge: config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000,
  httpOnly: false,
  sameSite: 'lax'
};