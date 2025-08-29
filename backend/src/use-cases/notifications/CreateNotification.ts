import { Notification } from "../../domain/entities/Notification";
import { NotificationRepository } from "../../domain/interfaces/notificationRepositoryInterface";
import { CreateNotificationDto } from "../../interface/dto/NotificationDto";
export class CreateNotification {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(dto: CreateNotificationDto): Promise<Notification> {
    return this.repository.create({
      userId: dto.userId,
      type: dto.type,
      title: dto.title,
      content: dto.content,
      relatedEntityType: dto.relatedEntityType,
      relatedEntityId: dto.relatedEntityId,
      isRead: false
    });
  }
}