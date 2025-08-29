import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRepository } from "../interfaces/UserRepository";
import { User } from "../entities/User";
import { BadRequestError } from "../../interface/errors/BadRequestError";
import { UnauthorizedError } from "../../interface/errors/UnauthorizedError";
import { env } from '../../shared/config/env';
import { UserRoles } from '../../shared/types';

export class AuthService {
  constructor(public readonly userRepository: UserRepository) {}

  async register(userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const role: UserRoles = (userData.role as UserRoles) || 'traveler';

    return this.userRepository.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role,
      isVerified: false
    });
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedError('Please verify your email first');
    }

    return user;
  }

  generateTokens(user: User): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  generateVerificationToken(userId: string): string {
    console.log("from generate verification"+env.JWT_SECRET)
    return jwt.sign(
      { userId },
      env.JWT_SECRET,
      { expiresIn: '1d' }
    );
  }

  decodeToken(token: string): { userId: string } {
    return jwt.decode(token) as { userId: string };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; newRefreshToken: string }> {
    try {
      const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string };
      const user = await this.userRepository.findById(payload.userId);
      
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const newAccessToken = jwt.sign(
        { userId: user.id, role: user.role },
        env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const newRefreshToken = jwt.sign(
        { userId: user.id },
        env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      return { accessToken: newAccessToken, newRefreshToken };
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      console.log("from verify email"+ env.JWT_SECRET);
      const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
      console.log(payload)
      await this.userRepository.verifyUser(payload.userId);
    } catch (error) {
      throw new UnauthorizedError('Invalid verification token');
    }
  }
}