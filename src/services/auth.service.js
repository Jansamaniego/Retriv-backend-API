import axios from 'axios';
import cloudinary from 'cloudinary';

import catchAsync from '../utils/catchAsync';
import { User, Token } from '../models';
import { uploadFile } from '../utils/cloudinary';
import dataUri from '../utils/datauri';
import tokenTypes from '../config/tokens';
import {
  generateAuthTokens,
  generateVerifyEmailToken,
  verifyToken
} from '../utils/token';
import {
  sendAfterResetPasswordMessage,
  sendVerificationEmail
} from '../utils/sendEmail';
import config from '../config/config';
import { getTokens } from '../utils/googleOAuth';
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions
} from '../config/cookie';

export const signUp = catchAsync(async (body, profileImage) => {
  if (profileImage === undefined) {
    return {
      type: 'Error',
      message: 'Profile image is required',
      statusCode: 400
    };
  }

  console.log(profileImage);

  const {
    firstName,
    lastName,
    username,
    email,
    password,
    passwordConfirmation
  } = body;
  let { address, phone, gender, dateOfBirth } = body;

  if (
    !firstName ||
    !lastName ||
    !username ||
    !email ||
    !password ||
    !passwordConfirmation
  ) {
    return {
      type: 'Error',
      message: 'Please fill out the required fields',
      statusCode: 400
    };
  }

  if (!address) address = '';
  if (!phone) phone = '';
  if (!gender) gender = 'undisclosed';
  if (!dateOfBirth) dateOfBirth = '';

  if (password.length < 8) {
    return {
      type: 'Error',
      message: 'Password should have more than 8 characters',
      statusCode: 400
    };
  }

  const takenEmail = await User.isEmailTaken(email);

  if (takenEmail) {
    return {
      type: 'Error',
      message: 'Email is already taken',
      statusCode: 409
    };
  }

  const folderName = `Users/${email.trim().split(' ').join('')}`;
  const image = await uploadFile(
    dataUri(profileImage).content,
    folderName,
    600
  );

  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password,
    passwordConfirmation,
    address,
    phone,
    gender,
    dateOfBirth,
    profileImage: image.secure_url,
    profileImageId: image.public_id
  });

  const tokens = await generateAuthTokens(user);

  const verifyEmailToken = await generateVerifyEmailToken(user);

  await sendVerificationEmail(user.email, verifyEmailToken);

  user.password = undefined;

  return {
    type: 'Success',
    message: 'Your account is registered successfully',
    statusCode: 201,
    user,
    tokens
  };
});

export const signIn = catchAsync(async (email, password) => {
  if (!email || !password) {
    return {
      type: 'Error',
      message: 'Email and password are required',
      statusCode: 400
    };
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return {
      type: 'Error',
      message: 'Incorrect email and / or password',
      statusCode: 401
    };
  }

  const isPasswordMatch = await user.isPasswordMatch(password);

  if (!isPasswordMatch) {
    return {
      type: 'Error',
      message: 'Incorrect email and / or password',
      statusCode: 401
    };
  }

  const tokens = await generateAuthTokens(user);

  user.password = undefined;

  return {
    type: 'Success',
    message: 'You have logged in successfully',
    statusCode: 200,
    tokens,
    user
  };
});

export const googleSignInCallback = catchAsync(async (code) => {
  let user;

  const { id_token, access_token } = await getTokens({
    code,
    clientId: config.googleOAuth.client.id,
    clientSecret: config.googleOAuth.client.secret,
    redirectUri: `${config.server.url}/${config.googleOAuth.redirectUri}`
  });

  const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`
        }
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    });

  if (!googleUser) {
    const error = new Error('google user is not found');
    error.code = 401;
    throw error;
  }

  const {
    email,
    name,
    given_name,
    family_name,
    picture,
    verified_email,
    address = '',
    phone = '',
    gender = 'undisclosed',
    dateOfBirth = ''
  } = googleUser;

  user = await User.findOne({ email: email });

  if (!user) {
    const folderName = `Users/${email.trim().split(' ').join('')}`;

    const image = await cloudinary.v2.uploader.upload(picture, {
      folder: `${config.cloud.project}/${folderName}`,
      width: 600,
      crop: 'fit',
      format: 'webp'
    });

    user = await User.create({
      firstName: given_name,
      lastName: family_name,
      username: name.replace(/\s/g, ''),
      email: email,
      isEmailVerified: verified_email,
      profileImage: image.secure_url,
      profileImageId: image.public_id,
      address,
      gender,
      dateOfBirth,
      phone,
      isGoogleAccount: true
    });

    if (!user) {
      const error = new Error('Unable to create new user');
      error.code = 400;
      throw error;
    }
  }

  const tokens = await generateAuthTokens(user);

  if (!tokens) {
    const error = new Error('Unable to generate tokens');
    error.code = 400;
    throw error;
  }

  return tokens;
});

export const signOut = catchAsync(async (refreshToken) => {
  const refreshTokenDoc = await Token.findOneAndDelete({
    token: refreshToken,
    type: tokenTypes.REFRESH
  });

  if (!refreshTokenDoc)
    return {
      type: 'Error',
      message: 'You are currently not logged in',
      statusCode: 401
    };

  return {
    type: 'Success',
    message: 'You have logged out successfully',
    statusCode: 200
  };
});

export const refreshAuth = catchAsync(async (refreshToken) => {
  const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);

  if (!refreshTokenDoc) {
    return {
      type: 'Error',
      message: 'No token found',
      statusCode: 404
    };
  }

  const user = await User.findById(refreshTokenDoc.user);

  if (!user) {
    return {
      type: 'Error',
      message: 'No user found',
      statusCode: 404
    };
  }

  const tokens = await generateAuthTokens(user);

  return {
    type: 'Success',
    message: 'Tokens are generated successfully',
    statusCode: 200,
    tokens
  };
});

export const changePassword = catchAsync(
  async (currentPassword, newPassword, newPasswordConfirmation, userId) => {
    if (newPassword !== newPasswordConfirmation) {
      return {
        type: 'Error',
        message: 'Password and passwordConfirmation do not match',
        statusCode: 400
      };
    }

    const user = await User.findById(userId).select('+password');

    if (!user) {
      return {
        type: 'Error',
        message: `User is not found`,
        statusCode: 404
      };
    }

    const isPasswordMatch = await user.isPasswordMatch(currentPassword);

    if (!isPasswordMatch) {
      return {
        type: 'Error',
        message: 'Wrong password',
        statusCode: 400
      };
    }

    user.password = newPassword;
    user.passwordConfirmation = newPasswordConfirmation;

    await user.save();

    return {
      type: 'Success',
      message: 'You changed your password successfully',
      statusCode: 200,
      user
    };
  }
);

export const resetPassword = catchAsync(
  async (token, password, passwordConfirmation) => {
    if (password !== passwordConfirmation) {
      return {
        type: 'Error',
        messge: 'passwords do not match',
        statusCode: 400
      };
    }

    const resetPasswordToken = await verifyToken(
      token,
      tokenTypes.RESET_PASSWORD
    );

    if (!resetPasswordToken) {
      return {
        type: 'Error',
        message: 'Invalid link',
        statusCode: 400
      };
    }

    const user = await User.findById(resetPasswordToken.user);

    if (!user) {
      return {
        type: 'Error',
        message: 'No user found',
        statusCode: 404
      };
    }

    user.password = password;

    await user.save();

    await sendAfterResetPasswordMessage(user.email);

    await Token.findByIdAndDelete(user.id, {
      type: tokenTypes.RESET_PASSWORD
    });

    return {
      type: 'Success',
      message: 'You reset your password successfully',
      statusCode: 200
    };
  }
);

export const verifyEmail = catchAsync(async (emailToken) => {
  const emailTokenDoc = await verifyToken(emailToken, tokenTypes.VERIFY_EMAIL);

  if (!emailTokenDoc) {
    return {
      type: 'Error',
      message: 'Invalid link',
      statusCode: 400
    };
  }

  const user = await User.findById(emailTokenDoc.user);

  if (!user) {
    return {
      type: 'Error',
      message: 'No user found',
      statusCode: 404
    };
  }

  await Token.findByIdAndDelete(user.id, {
    type: tokenTypes.VERIFY_EMAIL
  });

  const updatedUser = await User.findByIdAndUpdate(
    user.id,
    {
      isEmailVerified: true
    },
    { new: true }
  );

  return {
    type: 'Success',
    message: 'Your email is successfully verified',
    statusCode: 200,
    user: updatedUser
  };
});
