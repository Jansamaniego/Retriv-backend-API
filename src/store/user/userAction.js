import { USER_ACTION_TYPES } from './userTypes';
import { createAction } from '../../utils/createAction/createAction';

export const setCurrentUser = (user) =>
  createAction(USER_ACTION_TYPES.SET_CURRENT_USER, user);
