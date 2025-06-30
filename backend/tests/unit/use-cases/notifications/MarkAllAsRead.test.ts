import { MarkAllAsREa } from './MarkAllAsRead';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { mockDeep } from 'jest-mock-extended';

describe('MarkAllAsRead UseCase', () => {
  const mockRepo = mockDeep<NotificationRepository>();
  const useCase = new MarkAllAsRead(mockRepo);

  it('should mark all notifications as read', async () => {
    const userId = 'user-123';
    const affectedCount = 3;

    mockRepo.markAllAsRead.mockResolvedValue(affectedCount);

    const result = await useCase.execute({ userId });

    expect(mockRepo.markAllAsRead).toHaveBeenCalledWith(userId);
    expect(result).toEqual({ affectedCount });
  });

  it('should return zero if no unread notifications', async () => {
    const userId = 'user-456';
    mockRepo.markAllAsRead.mockResolvedValue(0);

    const result = await useCase.execute({ userId });

    expect(result.affectedCount).toBe(0);
  });
});