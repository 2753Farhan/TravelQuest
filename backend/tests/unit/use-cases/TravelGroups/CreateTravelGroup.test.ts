import { CreateTravelGroup } from "../../use-cases/TravelGroups.ts/CreateTravelGroup";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { CreateTravelGroupDto } from "../../interface/dto/TravelGroupDto";
import { TravelGroup } from "../../domain/entities/TravelGroup";
import { TripStatus } from "../../shared/types";

describe("CreateTravelGroup", () => {
  let createTravelGroup: CreateTravelGroup;
  let mockTravelGroupRepository: jest.Mocked<TravelGroupRepository>;

  beforeEach(() => {
    mockTravelGroupRepository = {
      createGroup: jest.fn(),
      findGroupById: jest.fn(),
      findGroupsByUser: jest.fn(),
      updateGroup: jest.fn(),
      deleteGroup: jest.fn(),
      addMember: jest.fn(),
      findMemberById: jest.fn(),
      findMembersByGroup: jest.fn(),
      findMemberByUserAndGroup: jest.fn(),
      updateMember: jest.fn(),
      removeMember: jest.fn(),
      acceptMemberInvitation: jest.fn(),
      declineMemberInvitation: jest.fn(),
      addItem: jest.fn(),
      findItemById: jest.fn(),
      findItemsByGroup: jest.fn(),
      updateItem: jest.fn(),
      removeItem: jest.fn(),
      voteOnItem: jest.fn(),
    } as any;

    createTravelGroup = new CreateTravelGroup(mockTravelGroupRepository);
  });

  it("should create a new travel group", async () => {
    const dto: CreateTravelGroupDto = {
      creatorId: "user1",
      title: "Europe Trip",
      startDate: "2023-07-01",
      endDate: "2023-07-15",
      status: "planning",
    };

    const mockGroup = new TravelGroup(
      "group1",
      "user1",
      "Europe Trip",
      new Date("2023-07-01"),
      new Date("2023-07-15"),
      "planning",
      new Date()
    );

    mockTravelGroupRepository.createGroup.mockResolvedValue(mockGroup);

    const result = await createTravelGroup.execute(dto);

    expect(mockTravelGroupRepository.createGroup).toHaveBeenCalledWith({
      creatorId: "user1",
      title: "Europe Trip",
      startDate: new Date("2023-07-01"),
      endDate: new Date("2023-07-15"),
      status: "planning",
    });
    expect(result).toEqual(mockGroup);
  });

  it("should handle optional fields with defaults", async () => {
    const dto: CreateTravelGroupDto = {
      creatorId: "user1",
      title: "Quick Getaway",
    };

    const mockGroup = new TravelGroup(
      "group2",
      "user1",
      "Quick Getaway",
      undefined,
      undefined,
      "planning",
      new Date()
    );

    mockTravelGroupRepository.createGroup.mockResolvedValue(mockGroup);

    const result = await createTravelGroup.execute(dto);

    expect(result.startDate).toBeUndefined();
    expect(result.status).toBe("planning");
  });

  it("should convert date strings to Date objects", async () => {
    const dto: CreateTravelGroupDto = {
      creatorId: "user1",
      title: "Date Test",
      startDate: "2023-08-01",
      endDate: "2023-08-10",
    };

    const mockGroup = new TravelGroup(
      "group3",
      "user1",
      "Date Test",
      new Date("2023-08-01"),
      new Date("2023-08-10"),
      "planning",
      new Date()
    );

    mockTravelGroupRepository.createGroup.mockResolvedValue(mockGroup);

    const result = await createTravelGroup.execute(dto);

    expect(result.startDate).toEqual(new Date("2023-08-01"));
    expect(result.endDate).toEqual(new Date("2023-08-10"));
  });
});