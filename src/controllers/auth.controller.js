import { authService } from '../services';
import catchAsync from '../utils/catchAsync';
import {
  sendResetPasswordEmail,
  sendVerificationEmail
} from '../utils/sendEmail';
import {
  generateResetPasswordToken,
  generateVerifyEmailToken
} from '../utils/token';
import {
  accessTokenCookieOptions,
  loggedInCookieOptions,
  refreshTokenCookieOptions
} from '../config/cookie';
import { getGoogleAuthURL } from '../utils/googleOAuth';
import { googleSignInCallback } from '../services/auth.service';
import config from '../config/config';

export const signUp = catchAsync(async (req, res) => {
  const { type, message, statusCode, user, tokens } = await authService.signUp(
    req.body,
    req.file
  );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  const { accessToken, refreshToken } = tokens;

  res.cookie('access_token', accessToken, accessTokenCookieOptions);
  res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions);

  return res.status(statusCode).json({
    type,
    message,
    tokens,
    user
  });
});

export const signIn = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const { type, message, statusCode, user, tokens } = await authService.signIn(
    email,
    password
  );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  const { accessToken, refreshToken } = tokens;

  res.cookie('access_token', accessToken, accessTokenCookieOptions);
  res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions);

  return res.status(statusCode).json({
    type,
    message,
    tokens,
    user
  });
});

export const googleSignIn = (req, res) => {
  return res.redirect(getGoogleAuthURL());
};

export const googleCallback = catchAsync(async (req, res) => {
  const tokens = await googleSignInCallback(req.query.code);

  const { accessToken, refreshToken } = tokens;

  res.cookie('access_token', accessToken, accessTokenCookieOptions);
  res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions);
  res.cookie('logged_in', true, loggedInCookieOptions);

  console.log(config.client.url, 'yoooooo!');

  return res.redirect(config.client.url);
});

export const signOut = catchAsync(async (req, res) => {
  const { type, message, statusCode } = await authService.signOut(
    req.cookies.refresh_token
  );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  res.clearCookie('access_token');
  res.clearCookie('refresh_token');

  return res.status(statusCode).json({
    type,
    message
  });
});

export const refreshTokens = catchAsync(async (req, res) => {
  const { type, message, statusCode, tokens } = await authService.refreshAuth(
    req.cookies.refresh_token
  );

  if (type === 'Error') {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.clearCookie('logged_in');

    return res.status(statusCode).json({
      type,
      message
    });
  }

  const { accessToken } = tokens;

  res.cookie('access_token', accessToken, accessTokenCookieOptions);

  return res.status(statusCode).json({
    type,
    message,
    tokens
  });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  const resetPasswordToken = await generateResetPasswordToken(email);

  await sendResetPasswordEmail(email, resetPasswordToken);

  return res.status(200).json({
    type: 'Success',
    message: 'Reset password email is sent successfully'
  });
});

export const resetPassword = catchAsync(async (req, res) => {
  const { password, passwordConfirmation } = req.body;

  if (password !== passwordConfirmation) {
    return res.status(400).json({
      type: 'Success',
      message: 'Password and passwordConfirmation do not match'
    });
  }

  const { type, message, statusCode } = await authService.resetPassword(
    req.query.token,
    password,
    passwordConfirmation
  );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message
  });
});

export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword, newPasswordConfirmation } = req.body;

  const { type, message, statusCode, user } = await authService.changePassword(
    currentPassword,
    newPassword,
    newPasswordConfirmation,
    req.user.id
  );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    user
  });
});

export const sendEmailVerification = catchAsync(async (req, res) => {
  const { user } = req;

  if (user.isEmailVerified) {
    return res.status(400).json({
      type: 'Error',
      message: 'Your email is already verified'
    });
  }

  const verifyEmailToken = await generateVerifyEmailToken(user);

  console.log(user.email);

  await sendVerificationEmail(user.email, verifyEmailToken);

  return res.status(200).json({
    type: 'Success',
    message:
      'An email has been sent to your email address, please click the link on the mail to verify your email'
  });
});

export const verifyEmail = catchAsync(async (req, res) => {
  const { type, message, statusCode, user } = await authService.verifyEmail(
    req.query.token
  );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    user
  });
});
