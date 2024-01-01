import config from './config';

export const accessTokenCookieOptions = {
  maxAge: config.jwt.accessExpirationMinutes * 60 * 1000,
  httpOnly: false,
  sameSite: 'none',
  secure: true
};

export const refreshTokenCookieOptions = {
  maxAge: config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000,
  httpOnly: false,
  sameSite: 'none',
  secure: true
};

export const loggedInCookieOptions = {
  maxAge: config.jwt.accessExpirationMinutes * 60 * 1000,
  httpOnly: false,
  sameSite: 'none',
  secure: true,
  domain: config.client.url
};
