
import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateNotification } from "../../use-cases/notifications/CreateNotification.ts";
import { GetUserNotifications } from "../../use-cases/notifications/GetUserNotifications.ts";
import { MarkNotificationAsRead } from "../../use-cases/notifications/MarkNotificationAsRead.ts";
import { MarkAllAsRead } from "../../use-cases/notifications/MarkAllAsRead.ts";
import { CreateNotificationDto,NotificationResponseDto,MarkAsReadDto  } from "../dto/NotificationDto.ts";
import { BadRequestError } from "../errors/BadRequestError.ts";
import { asyncHandler } from "../middlewares/asyncHandler.ts";

export class NotificationController {
  constructor(
    private readonly createNotification: CreateNotification,
    private readonly getUserNotifications: GetUserNotifications,
    private readonly markNotificationAsRead: MarkNotificationAsRead,
    private readonly markAllAsRead: MarkAllAsRead
  ) {}

  create = async (req: Request, res: Response) => {
    const dto = plainToInstance(CreateNotificationDto, req.body);
    const errors = await validate(dto);
    
    if (errors.length > 0) {
      throw new BadRequestError(errors.toString());
    }

    const notification = await this.createNotification.execute(dto);
    res.status(201).json(NotificationResponseDto.fromDomain(notification));
  };

  getUserNotificationsHandler = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const unreadOnly = req.query.unread === 'true';
    
    if (!userId) throw new BadRequestError("User ID required");

    const notifications = await this.getUserNotifications.execute(userId, unreadOnly);
    res.json(notifications.map(NotificationResponseDto.fromDomain));
  };

  markAsRead = async (req: Request, res: Response) => {
    const dto = plainToInstance(MarkAsReadDto, req.body);
    const errors = await validate(dto);
    
    if (errors.length > 0) {
      throw new BadRequestError(errors.toString());
    }

    const notification = await this.markNotificationAsRead.execute(dto.notificationId);
    res.json(NotificationResponseDto.fromDomain(notification));
  };

  markAllAsReadHandler = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    if (!userId) throw new BadRequestError("User ID required");

    const count = await this.markAllAsRead.execute(userId);
    res.json({ success: true, markedCount: count });
  };
}