import { NextFunction, Request, Response } from "express";

export const CatchAsyncError =
  (
    theFunc: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await theFunc(req, res, next);
    } catch (error) {
      next(error);
    }
  };
