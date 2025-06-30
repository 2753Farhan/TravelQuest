import { VoteOnTripItem } from "../../use-cases/TravelGroups.ts/VoteOnTripItem";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { VoteItemDto } from "../../interface/dto/TravelGroupDto";
import { TripItem } from "../../domain/entities/TravelGroup";
import { NotFoundError } from "../../interface/errors/NotFoundError";

describe("VoteOnTripItem", () => {
  let voteOnTripItem: VoteOnTripItem;
  let mockTravelGroupRepository: jest.Mocked<TravelGroupRepository>;

  beforeEach(() => {
    mockTravelGroupRepository = {
      voteOnItem: jest.fn(),
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
    } as any;

    voteOnTripItem = new VoteOnTripItem(mockTravelGroupRepository);
  });

  it("should register an upvote on a trip item", async () => {
    const itemId = "item1";
    const dto: VoteItemDto = {
      userId: "user1",
      vote: "up",
    };

    const mockItem = new TripItem(
      "item1",
      "group1",
      "user2",
      "place1",
      undefined,
      undefined,
      undefined,
      undefined,
      "proposed",
      { user1: "up" },
      {},
      new Date(),
      new Date()
    );

    mockTravelGroupRepository.voteOnItem.mockResolvedValue(mockItem);

    const result = await voteOnTripItem.execute(itemId, dto);

    expect(mockTravelGroupRepository.voteOnItem).toHaveBeenCalledWith(
      "item1",
      "user1",
      "up"
    );
    expect(result.votes).toEqual({ user1: "up" });
  });

  it("should register a downvote on a trip item", async () => {
    const itemId = "item1";
    const dto: VoteItemDto = {
      userId: "user2",
      vote: "down",
    };

    const mockItem = new TripItem(
      "item1",
      "group1",
      "user1",
      "place1",
      undefined,
      undefined,
      undefined,
      undefined,
      "proposed",
      { user2: "down" },
      {},
      new Date(),
      new Date()
    );

    mockTravelGroupRepository.voteOnItem.mockResolvedValue(mockItem);

    const result = await voteOnTripItem.execute(itemId, dto);

    expect(result.votes).toEqual({ user2: "down" });
  });

  it("should throw error if item doesn't exist", async () => {
    const itemId = "nonexistent";
    const dto: VoteItemDto = {
      userId: "user1",
      vote: "up",
    };

    mockTravelGroupRepository.voteOnItem.mockRejectedValue(
      new NotFoundError("Trip item not found")
    );

    await expect(voteOnTripItem.execute(itemId, dto)).rejects.toThrow(NotFoundError);
  });
});