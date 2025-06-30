import { GetUserNotifications } from './GetUserNotifications';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { mockDeep } from 'jest-mock-extended';

describe('GetUserNotifications UseCase', () => {
  const mockRepo = mockDeep<NotificationRepository>();
  const useCase = new GetUserNotifications(mockRepo);

  it('should return user notifications', async () => {
    const userId = 'user-123';
    const mockNotifications = [
      { id: 'notif-1', userId, title: 'Notification 1', read: false },
      { id: 'notif-2', userId, title: 'Notification 2', read: true }
    ];

    mockRepo.findByUserId.mockResolvedValue(mockNotifications);

    const result = await useCase.execute({ userId });

    expect(mockRepo.findByUserId).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockNotifications);
    expect(result.length).toBe(2);
  });

  it('should return empty array if no notifications', async () => {
    const userId = 'user-456';
    mockRepo.findByUserId.mockResolvedValue([]);

    const result = await useCase.execute({ userId });

    expect(result).toEqual([]);
  });
});