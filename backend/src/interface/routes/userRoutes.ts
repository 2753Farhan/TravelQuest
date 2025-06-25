import { Router } from "express";
import { UserController } from "../controllers/userController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRoles } from "../../shared/types";

const router = Router();
const controller = new UserController();

router.get("/me", authMiddleware, asyncHandler(controller.getCurrent.bind(controller)));
router.patch("/me", authMiddleware, asyncHandler(controller.update.bind(controller)));


router.get("/", 
  authMiddleware, 
  roleMiddleware([UserRoles.ADMIN, UserRoles.MODERATOR]), 
  asyncHandler(controller.getAll.bind(controller))
);

export default router;