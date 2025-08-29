import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";


declare global {
  namespace Express {
    interface UserPayload {
      userId: string;
      role: UserRoles
     
    }
    interface Request {
      user?: UserPayload;
    }
  }
}
import { validate } from "class-validator";
import { RegisterUser } from "../../use-cases/auth/RegisterUser";
import { LoginUser } from "../../use-cases/auth/LoginUser";
import { RefreshToken } from "../../use-cases/auth/RefreshToken";
import { RegisterUserDto, LoginUserDto, RefreshTokenDto } from "../dto/AuthDto";
import { BadRequestError } from "../errors/BadRequestError";
import { asyncHandler } from "../middlewares/asyncHandler";
import { KnexUserRepository } from "../../infrastructure/repositories/KnexUserRepository";
import { AuthService } from "../../domain/services/AuthService";
import { EmailService } from "../../domain/services/EmailService";
import { UserRoles } from "../../shared/types";
export class AuthController {
  private registerUser: RegisterUser;
  private loginUser: LoginUser;
  private refreshToken: RefreshToken;

  constructor() {
    const userRepository = new KnexUserRepository();
    const authService = new AuthService(userRepository);
    const emailService = new EmailService();

    this.registerUser = new RegisterUser(userRepository, authService, emailService);
    this.loginUser = new LoginUser(authService);
    this.refreshToken = new RefreshToken(authService);
  }

  register = async (req: Request, res: Response) => {
    const dto = plainToInstance(RegisterUserDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestError(errors.toString());
    }

    const result = await this.registerUser.execute(dto);
    res.status(201).json(result);
  };

  login = async (req: Request, res: Response) => {
    const dto = plainToInstance(LoginUserDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestError(errors.toString());
    }

    const result = await this.loginUser.execute(dto);
    res.json(result);
  };

  refresh = async (req: Request, res: Response) => {
    const dto = plainToInstance(RefreshTokenDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestError(errors.toString());
    }

    const result = await this.refreshToken.execute(dto);
    res.json(result);
  };

  verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.params;
    const userRepository = new KnexUserRepository();
    const authService = new AuthService(userRepository);
    await authService.verifyEmail(token);
    res.json({ message: 'Email verified successfully' });
  };

  logout = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (userId) {
      const userRepository = new KnexUserRepository();
      await userRepository.updateRefreshToken(userId, null);
    }
    res.json({ message: 'Logged out successfully' });
  };
}