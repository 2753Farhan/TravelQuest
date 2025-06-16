import { Router } from "express";
import { UserController } from "../controllers/userController";
import { KnexUserRepository } from "../../infrastructure/repositories/KnexUserRepository";
import { CreateUser } from "../../use-cases/users/CreateUser";
import { GetUsers } from "../../use-cases/users/GetUsers";
const router = Router();

// Initialize dependencies
const userRepository = new KnexUserRepository();
const createUser = new CreateUser(userRepository);
const getUsers = new GetUsers(userRepository);
const userController = new UserController(createUser, getUsers);

// Routes
router.post("/", userController.create.bind(userController));
router.get("/", userController.findAll.bind(userController));

export default router;
