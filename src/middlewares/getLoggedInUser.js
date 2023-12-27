import catchAsync from '../utils/catchAsync';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { User } from '../models/index';
import config from '../config/config';

const getLoggedInUser = catchAsync(async (req, res, next) => {
  // 1) Getting the token
  console.log(req.query);

  const token = req.cookies.access_token;

  // 2) Check if token does not exist
  if (!token) {
    req.user = null;
    return next();
  }

  // 3) Token verification
  const decoded = await promisify(jwt.verify)(token, config.jwt.secret);

  // 4) Extract user data from database
  const currentUser = await User.findById(decoded.sub);

  // 5) Check if user does not exist
  if (!currentUser) {
    req.user = null;
    return next();
  }

  // 6) Check if user changed password after the token was issued
  if (currentUser.passwordsChangedAfter(decoded.iat)) {
    req.user = null;
    return next();
  }

  req.user = currentUser;
  next();
});

export default getLoggedInUser;
