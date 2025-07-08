import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { GetCurrentUser } from "../../use-cases/users/GetCurrentUser";
import { UpdateUser } from "../../use-cases/users/UpdateUser";
import { GetAllUsers } from "../../use-cases/users/GetAllUser";
import { UpdateUserDto } from "../dto/UserDto";
import { BadRequestError } from "../errors/BadRequestError";
import { asyncHandler } from "../middlewares/asyncHandler";
import { KnexUserRepository } from "../../infrastructure/repositories/KnexUserRepository";

export class UserController {
  private getCurrentUser: GetCurrentUser;
  private updateUser: UpdateUser;
  private getAllUsers: GetAllUsers;

  constructor() {
    const userRepository = new KnexUserRepository();
    this.getCurrentUser = new GetCurrentUser(userRepository);
    this.updateUser = new UpdateUser(userRepository);
    this.getAllUsers = new GetAllUsers(userRepository);
  }

  getCurrent = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError("User not authenticated");
    }
    const user = await this.getCurrentUser.execute(req.user.userId);
    res.json(user);
  };

  update = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError("User not authenticated");
    }

    const dto = plainToInstance(UpdateUserDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestError(errors.toString());
    }

    const updatedUser = await this.updateUser.execute(req.user.userId, dto);
    res.json(updatedUser);
  };

  getAll = async (req: Request, res: Response) => {
    const users = await this.getAllUsers.execute();
    res.json(users);
  };


  getUserById = async (req: Request, res: Response) => {
    const userId = req.params.id;
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }

    const user = await this.getCurrentUser.execute(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    res.json(user);
  }
}