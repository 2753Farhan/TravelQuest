import { Request, Response } from "express";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator"
import { CreateUser } from "../../use-cases/users/CreateUser";
import { GetUsers } from "../../use-cases/users/GetUsers";
import { CreateUserDto,UserResponseDto } from "../dto/CreateUserDto";
import { BadRequestError } from "../errors/BadRequestError";
export class UserController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly getUsers: GetUsers
  ) {}

 async create(req: Request, res: Response): Promise<void> {
    const dto = plainToInstance(CreateUserDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const message = errors
        .map((e) => Object.values(e.constraints || {}).join(", "))
        .join("; ");
      throw new BadRequestError(message);
    }

      const user = await this.createUser.execute(dto);
      res.status(201).json(UserResponseDto.fromDomain(user));

  }

   async findAll(_req: Request, res: Response) : Promise<void> {

      const users = await this.getUsers.execute();
      res.json(users.map(UserResponseDto.fromDomain));

  }
}







// import { Request, Response } from "express";
// import { CreateUser } from "../../use-cases/users/CreateUser";
// import { GetUsers } from "../../use-cases/users/GetUsers";
// import { CreateUserDto } from "../dto/CreateUserDto";
// export class UserController {
//   constructor(
//     private readonly createUser: CreateUser,
//     private readonly getUsers: GetUsers
//   ) {}

//   async create(req: Request, res: Response): Promise<void> {
//     try {
//       const userData: CreateUserDto = req.body;
//       const user = await this.createUser.execute(userData);
//       res.status(201).json(user);
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : "Unknown error";
//       res.status(500).json({ error: errorMessage });
//     }
//   }

//   async findAll(req: Request, res: Response): Promise<void> {
//     try {
//       const users = await this.getUsers.execute();
//       res.status(200).json(users);
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : "Unknown error";
//       res.status(500).json({ error: errorMessage });
//     }
//   }
// }