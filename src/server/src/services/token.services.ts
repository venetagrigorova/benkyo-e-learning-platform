import { tokenData } from "../data/token.data.js";
import { Token, } from "../interfaces/token.interface.js";
import { formatError, formatSuccess } from "./common/formatters.js";
import { ApiError, ApiSuccess } from "./common/interfaces.js";
import { serviceErrors } from "./service.errors.js";

const whitelistToken = async (token: Token): Promise<ApiSuccess | ApiError> => {
  const result = await tokenData.addToken(token);

  if (typeof result !== 'string') {
    return formatError(serviceErrors.UNKNOWN_ERROR);
  }

  return formatSuccess(token);
}

const isWhitelistedToken = async(token: Token): Promise<boolean> => {
  const tokenFromDB = await tokenData.getToken(token);

  if (typeof tokenFromDB !== 'string') {
    return false;
  }

  return true;
};

const blacklistToken = async (token: Token): Promise<number> => {
  const result = await tokenData.deleteToken(token);

  return result;
}

export const tokenServices = {
  whitelistToken,
  isWhitelistedToken,
  blacklistToken
};
