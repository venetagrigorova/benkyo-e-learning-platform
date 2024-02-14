import { NextFunction, Request, Response } from 'express';

const idChecker = async (
  req: Request,
  res: Response,
  next: NextFunction,
  id: any
) => {
  if (!Number.isInteger(+id)) {
    return res.status(400).json({
      status: '400 - Bad Request',
      errorMessage: 'ids in URL must be integer',
    });
  }

  next();
};

export default idChecker;
