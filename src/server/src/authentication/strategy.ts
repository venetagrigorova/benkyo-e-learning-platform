import passportJwt from 'passport-jwt';
import {TokenPayloadInterface} from '../interfaces/token.interface.js';
import { tokenServices } from '../services/token.services.js';

const options = {
  secretOrKey: process.env.PRIVATE_KEY,
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
};

interface VerifyCallBackUser {
  (error: null, user?: TokenPayloadInterface): void;
}

const jwtStrategy = new passportJwt.Strategy(
    options,
    async (payload: TokenPayloadInterface, done: VerifyCallBackUser) => {
      const userData: TokenPayloadInterface = {
        userId: payload.userId,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        role: payload.role,
      };
      // userData will be set as 'req.user' in the 'next' middleware
      done(null, userData);
    },
);

export default jwtStrategy;
