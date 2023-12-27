import { User } from '../models';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import dataUri from '../utils/datauri';

import { destroyFile, uploadFile } from '../utils/cloudinary';
import apiFeatures from '../utils/apiFeatures';

export const createUser = catchAsync(async (body, profileImage) => {
  if (profileImage === undefined || profileImage.lenth === 0) {
    return {
      type: 'Error',
      message: 'A profile image is required',
      statusCode: 400
    };
  }

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

  const takenEmail = await User.isEmailTaken(email);

  if (takenEmail) {
    return {
      type: 'Error',
      message: 'Email is already taken',
      statusCode: 409
    };
  }

  const folderName = `Users/${email}`;

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

  return {
    type: 'Success',
    message: 'User is created successfully',
    statusCode: 201,
    user
  };
});

export const queryUsers = catchAsync(async (req) => {
  const users = await apiFeatures(req, User, {
    path: 'shops',
    select: 'name address shopImage shopImageId -owner'
  });

  if (users.length === 0) {
    return {
      type: 'Error',
      message: 'No users found',
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'Users successfully found',
    statusCode: 200,
    users
  };
});

export const queryUser = catchAsync(async (id) => {
  const user = await User.findById(id)
    .populate('shops')
    .populate('defaultShop');

  if (!user) {
    return {
      type: 'Error',
      message: `User is not found`,
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'User found',
    statusCode: 200,
    user
  };
});

export const updateUserDetails = catchAsync(async (user, body) => {
  const { id } = user;

  const { firstName, lastName, username, email } = body;

  let { address, phone, dateOfBirth, gender } = body;

  if (!firstName || !lastName || !username || !email) {
    return {
      type: 'Error',
      message: 'Please fill out the required fields',
      statusCode: 400
    };
  }

  const takenEmail = await User.isEmailTaken(email, id);

  if (takenEmail) {
    return {
      type: 'Error',
      message: 'Email is already taken',
      statusCode: 409
    };
  }

  if (!address) address = '';
  if (!phone) phone = undefined;
  if (!gender) gender = undefined;
  if (!dateOfBirth) dateOfBirth = undefined;

  const updatedUser = await User.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  return {
    type: 'Success',
    message: 'User is found and updated successfully',
    statusCode: 200,
    user: updatedUser
  };
});

export const updateUserDetailsAdmin = catchAsync(async (body) => {
  const { firstName, lastName, username, email, id } = body;

  let { address, phone, dateOfBirth, gender } = body;

  if (!firstName || !lastName || !username || !email) {
    return {
      type: 'Error',
      message: 'Please fill out the required fields',
      statusCode: 400
    };
  }

  const takenEmail = await User.isEmailTaken(email, id);

  if (takenEmail) {
    return {
      type: 'Error',
      message: 'Email is already taken',
      statusCode: 409
    };
  }

  if (!address) address = '';
  if (!phone) phone = undefined;
  if (!gender) gender = undefined;
  if (!dateOfBirth) dateOfBirth = undefined;

  const user = await User.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  return {
    type: 'Success',
    message: 'User is found and updated successfully',
    statusCode: 200,
    user
  };
});

export const updateUserProfileImage = catchAsync(async (user, profileImage) => {
  const { email, profileImageId, id } = user;

  destroyFile(profileImageId);

  const folderName = `Users/${email}`;

  const image = await uploadFile(
    dataUri(profileImage).content,
    folderName,
    600
  );

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      profileImage: image.secure_url,
      profileImageId: image.public_id
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return {
      type: 'Error',
      message: 'Updating user profile image failed',
      statusCode: 400
    };
  }

  return {
    type: 'Success',
    message: 'User is found and updated successfully',
    statusCode: 200,
    user: updatedUser
  };
});

export const setDefaultShop = catchAsync(async (userId, shopId) => {
  const user = await User.findOneAndUpdate(
    {
      $and: [{ _id: userId }, { shops: shopId }]
    },
    {
      $set: {
        defaultShop: shopId
      }
    },
    { new: true }
  );

  if (!user) {
    return {
      type: 'Error',
      message: 'User is not found',
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'User defaultShop is updated successfully',
    statusCode: 200,
    user
  };
});

export const deleteUser = catchAsync(async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    return {
      type: 'Error',
      message: 'User is not found',
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'User deleted successfully',
    statusCode: 200,
    user
  };
});

export const deleteMyAccount = catchAsync(async (user) => {
  const { id, profileImageId } = user;

  destroyFile(profileImageId);

  const deletedUser = await User.findByIdAndDelete(id);

  if (!user) {
    return {
      type: 'Error',
      message: `No user found`,
      statusCode: 404
    };
  }

  return {
    type: 'Success',
    message: 'You account is deleted successfully',
    statusCode: 200,
    user: deletedUser
  };
});
