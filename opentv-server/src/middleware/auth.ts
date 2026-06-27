import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../generated/prisma";

import config from "../config";
import AppError from "../errors/AppError";

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers?.authorization;
    if (!authHeader) {
      throw new AppError(403, "Unauthorized access");
    }
    
    // Swagger UI and standard HTTP clients prepend 'Bearer ' to the token
    const token = authHeader.startsWith("Bearer ") 
      ? authHeader.split(" ")[1] 
      : authHeader;

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    if (!decoded) {
      throw new AppError(403, "Unauthorized access");
    }
    if (roles.length > 0 && !roles.includes(decoded?.role as UserRole)) {
      throw new AppError(403, "Forbidden access");
    } else {
      req.user = decoded;
      next();
    }
  };
};

export default auth;