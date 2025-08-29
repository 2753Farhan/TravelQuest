import { Router } from "express";
import { UserController } from "../controllers/userController";
import { KnexUserRepository } from "../../infrastructure/repositories/KnexUserRepository";
import { CreateUser } from "../../use-cases/users/CreateUser";
import { GetUsers } from "../../use-cases/users/GetUsers";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();

const userRepository = new KnexUserRepository();
const createUser = new CreateUser(userRepository);
const getUsers = new GetUsers(userRepository);
const userController = new UserController(createUser, getUsers);

router.post("/", asyncHandler(userController.create.bind(userController)));
router.get("/", asyncHandler(userController.findAll.bind(userController)));

export default router;