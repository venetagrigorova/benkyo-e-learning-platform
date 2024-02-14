import { NextFunction, Request, Response } from 'express';
import passport, { Authenticator } from 'passport';
import { UserRoles } from '../common/user-roles.enum.js';
import { TokenPayloadInterface } from '../interfaces/token.interface.js';
import { formatError } from '../services/common/formatters.js';
import { serviceErrors } from '../services/service.errors.js';
import { tokenServices } from '../services/token.services.js';

export const authorizeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): Authenticator => {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user: TokenPayloadInterface | false) => {
      if (!user) {
        req.user = { role: 'anonymous' };
      } else {
        req.user = user;
      }
      next();
    }
  )(req, res, next);
};

export const roleMiddleware = (
  roles: UserRoles[]
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return async (req: Request, res, next) => {
    const user = req.user as TokenPayloadInterface;

    if ([UserRoles.STUDENT, UserRoles.TEACHER].includes(user.role)) {
      const token = req.headers.authorization?.split(' ')[1];
      const isWhitelisted =
        token && (await tokenServices.isWhitelistedToken(token));
      if (!isWhitelisted) {
        res
          .status(403)
          .send(formatError(serviceErrors.OPERATION_NOT_PERMITTED));
        return;
      }
    }
    if (roles.some((r: string) => r === user.role)) {
      next();
    } else {
      res.status(403).send(formatError(serviceErrors.OPERATION_NOT_PERMITTED));
    }
  };
};
