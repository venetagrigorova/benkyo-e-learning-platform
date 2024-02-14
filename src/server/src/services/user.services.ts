import { EditUserInfo } from './../interfaces/user-info.interface';
import bcrypt from 'bcrypt';
import {EmailId} from '../common/user-roles.enum.js';
import {userData} from '../data/user.data.js';
import {NewUserWithRole} from '../interfaces/user-info.interface.js';
import {formatError, formatSuccess} from './common/formatters.js';
import {ApiError, ApiSuccess} from './common/interfaces.js';
import {serviceErrors} from './service.errors.js';

const createUser = async (newUser: NewUserWithRole)
: Promise<ApiError | ApiSuccess> => {
  const existingUser = await userData.getUserInfo(
    EmailId.EMAIL,
    newUser.email);

  if (existingUser.userId) {
    return formatError(serviceErrors.DUPLICATE_RECORD);
  }

  const passwordHash = await bcrypt.hash(newUser.password, 10);
  const createdUser = await userData.createUser({
    ...newUser,
    password: passwordHash},
  );

  if (createdUser.userId) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, ...userClean} = createdUser;
    return formatSuccess(userClean);
  }

  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const editUser = async (newUserData: EditUserInfo)
: Promise<ApiError | ApiSuccess> => {
  const existingUser = await userData.getUser(newUserData.userId);

  if (existingUser) {
    const result = await userData.editUser(newUserData);

    if (result) {
      return formatSuccess(result);
    } else {
      return formatError(serviceErrors.VALIDATION_ERROR);
    }
  } else {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }
  return formatError(serviceErrors.UNKNOWN_ERROR);
};

const getAllUsersInfo = async (): Promise<ApiError | ApiSuccess> => {
  const result = await userData.getAllUsersBaseInfo();

  if (result[0]) {
    return formatSuccess(result);
  }

  return formatError(serviceErrors.RECORD_NOT_FOUND);
};

const getUserInfo = async (userId: number): Promise<ApiError | ApiSuccess> => {
  const result = await userData.getUserBaseInfo(userId);

  if (result[0]) {
    return formatSuccess(result);
  }

  return formatError(serviceErrors.RECORD_NOT_FOUND);
};


export const usersServices = {
  createUser,
  editUser,
  getAllUsersInfo,
  getUserInfo,
};
