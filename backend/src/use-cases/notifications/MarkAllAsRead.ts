import { NotificationRepository } from "../../domain/interfaces/notificationRepositoryInterface";
export class MarkAllAsRead {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(userId: string): Promise<number> {
    return this.repository.markAllAsRead(userId);
  }
}