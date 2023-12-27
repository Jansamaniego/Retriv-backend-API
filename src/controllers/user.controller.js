import catchAsync from '../utils/catchAsync';
import { userService } from '../services';

export const createUser = catchAsync(async (req, res) => {
  const { type, message, statusCode, user } = await userService.createUser(
    req.body,
    req.file
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

export const getUsers = catchAsync(async (req, res) => {
  let { page, sort, limit, select } = req.query;

  if (!page) page = 1;
  if (!sort) sort = '';
  if (!limit) limit = 10;
  if (!select) select = '';

  const { type, message, statusCode, users } = await userService.queryUsers(
    req
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
    users
  });
});

export const getUser = catchAsync(async (req, res) => {
  const { type, message, statusCode, user } = await userService.queryUser(
    req.params.userId
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

export const getMe = catchAsync(async (req, res) => {
  const { type, message, statusCode, user } = await userService.queryUser(
    req.user._id
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

export const updateUserDetails = catchAsync(async (req, res) => {
  const { type, message, statusCode, user } =
    await userService.updateUserDetails(req.user, req.body);

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

export const updateUserDetailsAdmin = catchAsync(async (req, res) => {
  const { type, message, statusCode, user } =
    await userService.updateUserDetailsAdmin(req.body);

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

export const updateUserProfileImage = catchAsync(async (req, res) => {
  const { type, message, statusCode, user } =
    await userService.updateUserProfileImage(req.user, req.file);

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

export const updateDefaultShop = catchAsync(async (req, res) => {
  const { type, message, statusCode, user } = await userService.setDefaultShop(
    req.user._id,
    req.params.shopId
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

export const deleteUser = catchAsync(async (req, res) => {
  const { type, message, statusCode, user } = await userService.deleteUser(
    req.params.userId
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

export const deleteMyAccount = catchAsync(async (req, res) => {
  const { type, message, statusCode, user } = await userService.deleteMyAccount(
    req.user
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
