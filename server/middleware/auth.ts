import { updateAccessToken } from "./../controllers/user.controller";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { redis } from "../utils/redis";
import { CatchAsyncError } from "./catchAsyncErrors";

interface AuthRequest extends Request {
  user?: IUser;
}

export const isAuthenticated = CatchAsyncError(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const access_token = req.cookies.access_token as string;

      if (!access_token) {
        return next(
          new ErrorHandler("Please login to access this resource", 400)
        );
      }

      const decoded = jwt.decode(access_token) as JwtPayload;

      if (!decoded) {
        return next(new ErrorHandler("access token is not valid", 400));
      }

      // check if the access token is expired
      if (decoded.exp && decoded.exp <= Date.now() / 1000) {
        try {
          await updateAccessToken(req, res, next);
        } catch (error) {
          return next(error);
        }
      } else {
        const user = await redis.get(decoded.id);

        if (!user) {
          return next(
            new ErrorHandler("Please login to access this resource", 400)
          );
        }

        req.user = JSON.parse(user);

        next();
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// validate user role
interface AuthRequest extends Request {
  user?: IUser; // Adjust the type as per your user object
}
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
