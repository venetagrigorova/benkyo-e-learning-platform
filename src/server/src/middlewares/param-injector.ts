import { NextFunction, Request, Response } from "express"

export const paramInjector = (property: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
      req.params[property] = req.params[property];
      next();
    }
};
