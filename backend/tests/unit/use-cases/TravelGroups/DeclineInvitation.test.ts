import { DeclineInvitation } from "../../use-cases/TravelGroups.ts/DeclineInvitation";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";
import { AcceptInvitationDto } from "../../interface/dto/TravelGroupDto";
import { TripMember } from "../../domain/entities/TravelGroup";

describe("DeclineInvitation", () => {
  let declineInvitation: DeclineInvitation;
  let mockTravelGroupRepository: jest.Mocked<TravelGroupRepository>;

  beforeEach(() => {
    mockTravelGroupRepository = {
      declineMemberInvitation: jest.fn(),
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
      addItem: jest.fn(),
      findItemById: jest.fn(),
      findItemsByGroup: jest.fn(),
      updateItem: jest.fn(),
      removeItem: jest.fn(),
      voteOnItem: jest.fn(),
    } as any;

    declineInvitation = new DeclineInvitation(mockTravelGroupRepository);
  });

  it("should decline a member invitation", async () => {
    const dto: AcceptInvitationDto = {
      membershipId: "member1",
      userId: "user1",
      action: "decline",
    };

    const mockMember = new TripMember(
      "member1",
      "group1",
      "user1",
      "member",
      "declined",
      {},
      undefined,
      new Date()
    );

    mockTravelGroupRepository.declineMemberInvitation.mockResolvedValue(mockMember);

    const result = await declineInvitation.execute(dto);

    expect(mockTravelGroupRepository.declineMemberInvitation).toHaveBeenCalledWith(
      "member1",
      "user1"
    );
    expect(result.invitationStatus).toBe("declined");
    expect(result.joinedAt).toBeUndefined();
  });

  it("should throw error if invitation is not pending", async () => {
    const dto: AcceptInvitationDto = {
      membershipId: "member1",
      userId: "user1",
      action: "decline",
    };

    mockTravelGroupRepository.declineMemberInvitation.mockRejectedValue(
      new Error("Invitation is not pending")
    );

    await expect(declineInvitation.execute(dto)).rejects.toThrow(
      "Invitation is not pending"
    );
  });
});