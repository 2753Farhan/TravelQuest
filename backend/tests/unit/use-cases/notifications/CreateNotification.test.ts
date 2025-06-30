import { CreateNotification } from "../../use-cases/notifications/CreateNotification";
import { NotificationRepository } from "../../domain/interfaces/notificationRepositoryInterface";
import { CreateNotificationDto } from "../../interface/dto/NotificationDto";
import { Notification } from "../../domain/entities/Notification";

describe("CreateNotification", () => {
  let createNotification: CreateNotification;
  let mockNotificationRepository: jest.Mocked<NotificationRepository>;

  beforeEach(() => {
    mockNotificationRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      delete: jest.fn(),
    } as any;

    createNotification = new CreateNotification(mockNotificationRepository);
  });

  it("should create a new notification", async () => {
    const dto: CreateNotificationDto = {
      userId: "user1",
      type: "invitation",
      title: "Trip Invitation",
      content: "You've been invited to join a trip",
      relatedEntityType: "trip_members",
      relatedEntityId: "member1",
    };

    const mockNotification = new Notification(
      "notif1",
      "user1",
      "invitation",
      "Trip Invitation",
      "You've been invited to join a trip",
      "trip_members",
      "member1",
      false,
      new Date()
    );

    mockNotificationRepository.create.mockResolvedValue(mockNotification);

    const result = await createNotification.execute(dto);

    expect(mockNotificationRepository.create).toHaveBeenCalledWith({
      userId: "user1",
      type: "invitation",
      title: "Trip Invitation",
      content: "You've been invited to join a trip",
      relatedEntityType: "trip_members",
      relatedEntityId: "member1",
      isRead: false,
    });
    expect(result).toEqual(mockNotification);
  });

  it("should handle optional related entity fields", async () => {
    const dto: CreateNotificationDto = {
      userId: "user1",
     