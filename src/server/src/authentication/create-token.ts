import jwt from 'jsonwebtoken';
import {TokenPayloadInterface} from '../interfaces/token.interface';

export const createToken = (payload: TokenPayloadInterface): string => {
  const options = {
    expiresIn: 86400,
  };

  return jwt.sign(payload, process.env.PRIVATE_KEY || '', options);
};
