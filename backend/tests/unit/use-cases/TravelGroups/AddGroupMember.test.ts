import { AddGroupMember } from "../../use-cases/TravelGroups.ts/AddGroupMember";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { AddMemberDto } from "../../interface/dto/TravelGroupDto";
import { TripMember } from "../../domain/entities/TravelGroup";

describe("AddGroupMember", () => {
  let addGroupMember: AddGroupMember;
  let mockTravelGroupRepository: jest.Mocked<TravelGroupRepository>;

  beforeEach(() => {
    mockTravelGroupRepository = {
      addMember: jest.fn(),
      createGroup: jest.fn(),
      findGroupById: jest.fn(),
      findGroupsByUser: jest.fn(),
      updateGroup: jest.fn(),
      deleteGroup: jest.fn(),
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

    addGroupMember = new AddGroupMember(mockTravelGroupRepository);
  });

  it("should add a new member to the group", async () => {
    const dto: AddMemberDto = {
      tripId: "group1",
      userId: "user2",
      role: "member",
      invitationStatus: "pending",
      invitationDetails: { invitedBy: "user1" },
    };

    const mockMember = new TripMember(
      "member1",
      "group1",
      "user2",
      "member",
      "pending",
      { invitedBy: "user1" }
    );

    mockTravelGroupRepository.addMember.mockResolvedValue(mockMember);

    const result = await addGroupMember.execute(dto);

    expect(mockTravelGroupRepository.addMember).toHaveBeenCalledWith({
      tripId: "group1",
      userId: "user2",
      role: "member",
      invitationStatus: "pending",
      invitationDetails: { invitedBy: "user1" },
    });
    expect(result).toEqual(mockMember);
  });

  it("should set default invitation status if not provided", async () => {
    const dto: AddMemberDto = {
      tripId: "group1",
      userId: "user2",
      role: "member",
    };

    const mockMember = new TripMember(
      "member1",
      "group1",
      "user2",
      "member",
      "pending",
      {}
    );

    mockTravelGroupRepository.addMember.mockResolvedValue(mockMember);

    const result = await addGroupMember.execute(dto);

    expect(result.invitationStatus).toBe("pending");
  });
});