import {Response} from 'express';
import {serviceErrors} from '../services/service.errors.js';
import {createToken} from '../authentication/create-token.js';
import {CustomRequest} from '../interfaces/request.interface.js';
import {authServices} from '../services/auth.services.js';
import {
  UserCredentials,
  UserInfoDBPassword,
} from '../interfaces/user-info.interface.js';
import {tokenServices} from '../services/token.services.js';
import {ApiError, ApiSuccess} from '../services/common/interfaces.js';
import {validationResult} from '../validators/validation-result.js';

const authenticateUser = async (
  req: CustomRequest<UserCredentials>,
  res: Response): Promise<void> => {
  if (validationResult(req, res, 400)) {
    return;
  }
  const user = req.body;
  const userDB: ApiSuccess | ApiError = await authServices
    .authenticateUser(user);
  if (typeof userDB.errorCode === 'number') {
    if (userDB.errorCode === serviceErrors.RECORD_NOT_FOUND) {
      res.status(404).send(userDB);
    } else if (userDB.errorCode === serviceErrors.INVALID_SIGNIN) {
      res.status(400).send(userDB);
    }
    return;
  }

  const userData = userDB.data as UserInfoDBPassword;

  const payload = {
    userId: userData.userId,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.role,
  };

  const token = createToken(payload);
  const resultToken = await tokenServices.whitelistToken(token);

  if (resultToken.errorCode) {
    res.status(500).send(resultToken);
    return;
  }

  res.status(201).json(resultToken);
  return;
};

const logout = async (
  req: CustomRequest<UserCredentials>,
  res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  const result = await authServices.logoutUser(token || '');

  if (result.errorCode) {
    res.status(500).send(result);
    return;
  }

  res.status(200).json(result);
  return;
};

export const authController = {
  authenticateUser,
  logout,
};
