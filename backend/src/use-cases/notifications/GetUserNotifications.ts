import { Notification } from "../../domain/entities/Notification";
import { NotificationRepository } from "../../domain/interfaces/notificationRepositoryInterface";
export class GetUserNotifications {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    return this.repository.findByUserId(userId, unreadOnly);
  }
}