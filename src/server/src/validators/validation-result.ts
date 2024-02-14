import { Request, Response } from 'express';
import { validationResult as val } from 'express-validator';
import { formatError } from '../services/common/formatters.js';
import { serviceErrors } from '../services/service.errors.js';

const validationResult = (
  req: Request,
  res: Response,
  errorCode: number
): boolean => {
  const errors = val(req);

  if (!errors.isEmpty()) {
    res
      .status(errorCode)
      .json(formatError(serviceErrors.VALIDATION_ERROR, errors));
    return true;
  }

  return false;
};

export { validationResult };
