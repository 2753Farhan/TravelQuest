import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { env } from "../../shared/config/env";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { KnexUserRepository } from "../../infrastructure/repositories/KnexUserRepository";
import { UserRoles } from "../../shared/types";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: UserRoles;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required');
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string; role: UserRoles };

    // Verify user exists
    const userRepository = new KnexUserRepository();
    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = payload;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};