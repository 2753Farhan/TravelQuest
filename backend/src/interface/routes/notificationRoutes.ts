// src/interface/routes/notificationRoutes.ts
import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController";
import { KnexNotificationRepository } from "../../infrastructure/repositories/knexNotificationRepository";
import { CreateNotification } from "../../use-cases/notifications/CreateNotification";
import { GetUserNotifications } from "../../use-cases/notifications/GetUserNotifications";
import { MarkNotificationAsRead } from "../../use-cases/notifications/MarkNotificationAsRead";
import { MarkAllAsRead } from "../../use-cases/notifications/MarkAllAsRead";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();
const repository = new KnexNotificationRepository();

const createNotification = new CreateNotification(repository);
const getUserNotifications = new GetUserNotifications(repository);
const markNotificationAsRead = new MarkNotificationAsRead(repository);
const markAllAsRead = new MarkAllAsRead(repository);

const controller = new NotificationController(
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllAsRead
);

router.post("/", asyncHandler(controller.create.bind(controller)));
router.get("/user/:userId", asyncHandler(controller.getUserNotificationsHandler.bind(controller)));
router.patch("/mark-read", asyncHandler(controller.markAsRead.bind(controller)));
router.patch("/user/:userId/mark-all-read", asyncHandler(controller.markAllAsReadHandler.bind(controller)));

export default router;