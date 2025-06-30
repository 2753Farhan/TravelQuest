import { AcceptInvitation } from "../../use-cases/TravelGroups.ts/AcceptInvitation";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { AcceptInvitationDto } from "../../interface/dto/TravelGroupDto";
import { TripMember } from "../../domain/entities/TravelGroup";

describe("AcceptInvitation", () => {
  let acceptInvitation: AcceptInvitation;
  let mockTravelGroupRepository: jest.Mocked<TravelGroupRepository>;

  beforeEach(() => {
    mockTravelGroupRepository = {
      acceptMemberInvitation: jest.fn(),
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
      declineMemberInvitation: jest.fn(),
      addItem: jest.fn(),
      findItemById: jest.fn(),
      findItemsByGroup: jest.fn(),
      updateItem: jest.fn(),
      removeItem: jest.fn(),
      voteOnItem: jest.fn(),
    } as any;

    acceptInvitation = new AcceptInvitation(mockTravelGroupRepository);
  });

  it("should accept a member invitation", async () => {
    const dto: AcceptInvitationDto = {
      membershipId: "member1",
      userId: "user1",
      action: "accept",
    };

    const mockMember = new TripMember(
      "member1",
      "group1",
      "user1",
      "member",
      "accepted",
      {},
      new Date()
    );

    mockTravelGroupRepository.acceptMemberInvitation.mockResolvedValue(mockMember);

    const result = await acceptInvitation.execute(dto);

    expect(mockTravelGroupRepository.acceptMemberInvitation).toHaveBeenCalledWith(
      "member1",
      "user1"
    );
    expect(result.invitationStatus).toBe("accepted");
    expect(result.joinedAt).toBeDefined();
  });

  it("should throw error if invitation is not pending", async () => {
    const dto: AcceptInvitationDto = {
      membershipId: "member1",
      userId: "user1",
      action: "accept",
    };

    mockTravelGroupRepository.acceptMemberInvitation.mockRejectedValue(
      new Error("Invitation is not pending")
    );

    await expect(acceptInvitation.execute(dto)).rejects.toThrow(
      "Invitation is not pending"
    );
  });
});