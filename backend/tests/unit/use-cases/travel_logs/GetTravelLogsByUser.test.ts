import { GetTravelLogsByUser } from "../../../../src/use-cases/travel_logs/GetTravelLogsByUser";
import { TravelLogRepository } from "../../../../src/domain/interfaces/travelLogRepository";
import { TravelLog } from "../../../../src/domain/entities/TravelLog";

describe("GetTravelLogsByUser", () => {
  let getTravelLogsByUser: GetTravelLogsByUser;
  let mockTravelLogRepository: jest.Mocked<TravelLogRepository>;

  beforeEach(() => {
    mockTravelLogRepository = {
      findByCreator: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    getTravelLogsByUser = new GetTravelLogsByUser(mockTravelLogRepository);
  });

  it("should return all logs for a user", async () => {
    const mockLogs = [
      new TravelLog("log1", "Trip 1", "Desc 1", "user1", undefined, undefined, "public", "planning", new Date()),
      new TravelLog("log2", "Trip 2", "Desc 2", "user1", new Date(), new Date(), "private", "completed", new Date()),
    ];

    mockTravelLogRepository.findByCreator.mockResolvedValue(mockLogs);

    const result = await getTravelLogsByUser.execute("user1");

    expect(mockTravelLogRepository.findByCreator).toHaveBeenCalledWith("user1");
    expect(result).toEqual(mockLogs);
    expect(result.length).toBe(2);
  });

  it("should return empty array if user has no logs", async () => {
    mockTravelLogRepository.findByCreator.mockResolvedValue([]);

    const result = await getTravelLogsByUser.execute("user2");

    expect(result).toEqual([]);
  });
});