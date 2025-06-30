import { MarkNotificationAsRead } from '../../../../src/use-cases/notifications/MarkNotificationAsRead';
import { NotificationRepository } from '../../../../src/domain/interfaces/notificationRepositoryInterface';
import { mockDeep } from 'jest-mock-extended';

describe('MarkNotificationAsRead UseCase', () => {
  const mockRepo = mockDeep<NotificationRepository>();
  const useCase = new MarkNotificationAsRead(mockRepo);

  it('should mark a notification as read', async () => {
    const notificationId = 'notif-123';
    const mockNotification = {
      id: notificationId,
      userId: 'user-123',
      read: false
    };

    mockRepo.findById.mockResolvedValue(mockNotification);
    mockRepo.update.mockResolvedValue({
      ...mockNotification,
      read: true
    });

    const result = await useCase.execute({ notificationId });

    expect(mockRepo.findById).toHaveBeenCalledWith(notificationId);
    expect(mockRepo.update).toHaveBeenCalledWith(notificationId, { read: true });
    expect(result.read).toBe(true);
  });

  it('should throw error if notification not found', async () => {
    const notificationId = 'notif-999';
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute({ notificationId })).rejects.toThrow('Notification not found');
  });
});