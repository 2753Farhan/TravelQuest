import { AddTripItem } from "../../use-cases/TravelGroups.ts/AddTripItem";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { AddTripItemDto } from "../../interface/dto/TravelGroupDto";
import { TripItem } from "../../domain/entities/TravelGroup";

describe("AddTripItem", () => {
  let addTripItem: AddTripItem;
  let mockTravelGroupRepository: jest.Mocked<TravelGroupRepository>;

  beforeEach(() => {
    mockTravelGroupRepository = {
      addItem: jest.fn(),
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
      findItemById: jest.fn(),
      findItemsByGroup: jest.fn(),
      updateItem: jest.fn(),
      removeItem: jest.fn(),
      voteOnItem: jest.fn(),
    } as any;

    addTripItem = new AddTripItem(mockTravelGroupRepository);
  });

  it("should add a new trip item with place reference", async () => {
    const dto: AddTripItemDto = {
      groupId: "group1",
      placeId: "place1",
      startTime: "2023-07-01T10:00:00",
      endTime: "2023-07-01T12:00:00",
      date: "2023-07-01",
      status: "proposed",
      addedBy: "user1",
      details: { notes: "Visit museum" },
    };

    const mockItem = new TripItem(
      "item1",
      "group1",
      "user1",
      "place1",
      undefined,
      new Date("2023-07-01T10:00:00"),
      new Date("2023-07-01T12:00:00"),
      new Date("2023-07-01"),
      "proposed",
      {},
      { notes: "Visit museum" },
      new Date()
    );

    mockTravelGroupRepository.addItem.mockResolvedValue(mockItem);

    const result = await addTripItem.execute(dto);

    expect(mockTravelGroupRepository.addItem).toHaveBeenCalledWith({
      groupId: "group1",
      placeId: "place1",
      transportId: undefined,
      startTime: new Date("2023-07-01T10:00:00"),
      endTime: new Date("2023-07-01T12:00:00"),
      date: new Date("2023-07-01"),
      status: "proposed",
      votes: [],
      addedBy: "user1",
      details: { notes: "Visit museum" },
    });
    expect(result).toEqual(mockItem);
  });

  it("should add a new trip item with transport reference", async () => {
    const dto: AddTripItemDto = {
      groupId: "group1",
      transportId: "transport1",
      startTime: "2023-07-02T08:00:00",
      endTime: "2023-07-02T10:00:00",
      addedBy: "user1",
    };

    const mockItem = new TripItem(
      "item2",
      "group1",
      "user1",
      undefined,
      "transport1",
      new Date("2023-07-02T08:00:00"),
      new Date("2023-07-02T10:00:00"),
      undefined,
      "proposed",
      {},
      {},
      new Date()
    );

    mockTravelGroupRepository.addItem.mockResolvedValue(mockItem);

    const result = await addTripItem.execute(dto);

    expect(result.transportId).toBe("transport1");
    expect(result.placeId).toBeUndefined();
  });

  it("should handle optional fields with defaults", async () => {
    const dto: AddTripItemDto = {
      groupId: "group1",
      addedBy: "user1",
    };

    const mockItem = new TripItem(
      "item3",
      "group1",
      "user1",
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      "proposed",
      {},
      {},
      new Date()
    );

    mockTravelGroupRepository.addItem.mockResolvedValue(mockItem);

    const result = await addTripItem.execute(dto);

    expect(result.status).toBe("proposed");
    expect(result.votes).toEqual({});
  });
});