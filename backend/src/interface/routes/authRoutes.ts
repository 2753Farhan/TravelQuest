import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();
const controller = new AuthController();

router.post("/register", asyncHandler(controller.register.bind(controller)));
router.post("/login", asyncHandler(controller.login.bind(controller)));
router.post("/refresh-token", asyncHandler(controller.refresh.bind(controller)));
router.get("/verify-email/:token", asyncHandler(controller.verifyEmail.bind(controller)));
router.post("/logout", asyncHandler(controller.logout.bind(controller)));

export default router;