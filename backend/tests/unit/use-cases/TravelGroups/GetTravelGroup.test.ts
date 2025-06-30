import { GetTravelGroup } from "../../use-cases/TravelGroups.ts/GetTravelGroup";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { TravelGroup } from "../../domain/entities/TravelGroup";
import { NotFoundError } from "../../interface/errors/NotFoundError";

describe("GetTravelGroup", () => {
  let getTravelGroup: GetTravelGroup;
  let mockTravelGroupRepository: jest.Mocked<TravelGroupRepository>;

  beforeEach(() => {
    mockTravelGroupRepository = {
      findGroupById: jest.fn(),
      createGroup: jest.fn(),
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

    getTravelGroup = new GetTravelGroup(mockTravelGroupRepository);
  });

  it("should return a travel group by ID", async () => {
    const mockGroup = new TravelGroup(
      "group1",
      "user1",
      "Europe Trip",
      new Date("2023-07-01"),
      new Date("2023-07-15"),
      "planning",
      new Date()
    );

    mockTravelGroupRepository.findGroupById.mockResolvedValue(mockGroup);

    const result = await getTravelGroup.execute("group1");

    expect(mockTravelGroupRepository.findGroupById).toHaveBeenCalledWith("group1");
    expect(result).toEqual(mockGroup);
  });

  it("should throw NotFoundError if group doesn't exist", async () => {
    mockTravelGroupRepository.findGroupById.mockResolvedValue(null);

    await expect(getTravelGroup.execute("nonexistent")).rejects.toThrow(NotFoundError);
  });
});