import { GetUserTravelGroups } from "../../use-cases/TravelGroups.ts/GetUserTravelGrups";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { TravelGroup } from "../../domain/entities/TravelGroup";

describe("GetUserTravelGroups", () => {
  let getUserTravelGroups: GetUserTravelGroups;
  let mockTravelGroupRepository: jest.Mocked<TravelGroupRepository>;

  beforeEach(() => {
    mockTravelGroupRepository = {
      findGroupsByUser: jest.fn(),
      createGroup: jest.fn(),
      findGroupById: jest.fn(),
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

    getUserTravelGroups = new GetUserTravelGroups(mockTravelGroupRepository);
  });

  it("should return all travel groups for a user", async () => {
    const mockGroups = [
      new TravelGroup("group1", "user1", "Trip 1", undefined, undefined, "planning", new Date()),
      new TravelGroup("group2", "user1", "Trip 2", new Date(), new Date(), "active", new Date()),
    ];

    mockTravelGroupRepository.findGroupsByUser.mockResolvedValue(mockGroups);

    const result = await getUserTravelGroups.execute("user1");

    expect(mockTravelGroupRepository.findGroupsByUser).toHaveBeenCalledWith("user1");
    expect(result).toEqual(mockGroups);
    expect(result.length).toBe(2);
  });

  it("should return empty array if user has no groups", async () => {
    mockTravelGroupRepository.findGroupsByUser.mockResolvedValue([]);

    const result = await getUserTravelGroups.execute("user2");

    expect(result).toEqual([]);
  });
});