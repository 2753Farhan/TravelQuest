import { Router } from "express";
import { UserController } from "../controllers/userController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRoles } from "../../shared/types";
import { SwitchRole } from "../../use-cases/users/SwitchRole";
import { KnexUserRepository } from "../../infrastructure/repositories/KnexUserRepository";
import { GetCurrentUser } from "../../use-cases/users/GetCurrentUser";
import { UpdateUser } from "../../use-cases/users/UpdateUser";
import { GetAllUsers } from "../../use-cases/users/GetAllUser";

const router = Router();

const userRepository = new KnexUserRepository();
const getCurrentUser = new GetCurrentUser(userRepository);
const updateUser = new UpdateUser(userRepository);
const getAllUsers = new GetAllUsers(userRepository);
const switchRoleUseCase = new SwitchRole(userRepository);
const controller = new UserController(
  getCurrentUser,
  updateUser,
  getAllUsers,
  switchRoleUseCase
);

router.get("/me", authMiddleware, asyncHandler(controller.getCurrent.bind(controller)));
router.patch("/me", authMiddleware, asyncHandler(controller.update.bind(controller)));


router.get('/:id', 
   asyncHandler(controller.getUserById.bind(controller))
)
router.get("/", 
  authMiddleware, 
  roleMiddleware([UserRoles.ADMIN, UserRoles.MODERATOR]), 
  asyncHandler(controller.getAll.bind(controller))
);

router.patch(
  "/:id/role",
  authMiddleware,
  roleMiddleware([UserRoles.EXPLORER, UserRoles.TRAVELER]),
  asyncHandler(controller.switchUserRole.bind(controller))
);


export default router;