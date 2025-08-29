import { Notification } from "../../domain/entities/Notification";
import { NotificationRepository } from "../../domain/interfaces/notificationRepositoryInterface";
import { NotFoundError } from "../../interface/errors/NotFoundError";

export class MarkNotificationAsRead {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(notificationId: string): Promise<Notification> {
    return this.repository.markAsRead(notificationId);
  }
}