import { Request, Express } from "express";
declare global {
  namespace Express {
    interface Request {
      user?: any; // Assuming User is your user model
    }
  }
}
