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
import { SwitchRole } from "../../use-cases/users/SwitchRole";

export class UserController {

  constructor(
    private readonly getCurrentUser: GetCurrentUser,
    private readonly updateUser: UpdateUser,
    private readonly getAllUsers: GetAllUsers,
    private readonly switchRole: SwitchRole
  ) {}

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

  switchUserRole = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const newRole = req.body.role;

    if (!userId || !newRole) {
      throw new BadRequestError("User ID and new role are required");
    }

    const updatedUser = await this.switchRole.execute(userId, newRole);
    res.json(updatedUser);
  };
}