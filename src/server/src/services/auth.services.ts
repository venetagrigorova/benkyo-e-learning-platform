import bcrypt from 'bcrypt';
import { EmailId } from '../common/user-roles.enum.js';
import { userData } from '../data/user.data.js';
import { Token } from '../interfaces/token.interface.js';
// eslint-disable-next-line max-len
import { UserCredentials } from '../interfaces/user-info.interface.js';
import { formatError, formatSuccess } from './common/formatters.js';
import { ApiError, ApiSuccess } from './common/interfaces.js';
import { serviceErrors } from './service.errors.js';
import { tokenServices } from './token.services.js';

const authenticateUser = async (
  userCreds: UserCredentials
): Promise<ApiSuccess | ApiError> => {
  const user = await userData.getUserInfo(EmailId.EMAIL, userCreds.email);

  if (!user.userId) {
    return formatError(serviceErrors.RECORD_NOT_FOUND);
  }

  if (await bcrypt.compare(userCreds.password, user.password)) {
    return formatSuccess(user);
  } else {
    return formatError(serviceErrors.INVALID_SIGNIN);
  }
};

const logoutUser = async (token: Token): Promise<ApiSuccess | ApiError> => {
  const isBlacklisted = await tokenServices.blacklistToken(token);

  if (!isBlacklisted) {
    return formatError(serviceErrors.UNKNOWN_ERROR);
  }

  return formatSuccess(true);
};

export const authServices = { authenticateUser, logoutUser };
