import { GetTravelLog } from "../../../../src/use-cases/travel_logs/GetTravelLog";
import { TravelLogRepository } from "../../../../src/domain/interfaces/travelLogRepository";
import { TravelLog } from "../../../../src/domain/entities/TravelLog";
import { NotFoundError } from "../../../../src/interface/errors/NotFoundError";

describe("GetTravelLog", () => {
  let getTravelLog: GetTravelLog;
  let mockTravelLogRepository: jest.Mocked<TravelLogRepository>;

  beforeEach(() => {
    mockTravelLogRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      findByCreator: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    getTravelLog = new GetTravelLog(mockTravelLogRepository);
  });

  it("should return a travel log by ID", async () => {
    const mockLog = new TravelLog(
      "log1",
      "Paris Trip",
      "Amazing vacation",
      "user1",
      new Date("2023-06-01"),
      new Date("2023-06-07"),
      "public",
      "completed",
      new Date()
    );

    mockTravelLogRepository.findById.mockResolvedValue(mockLog);

    const result = await getTravelLog.execute("log1");

    expect(mockTravelLogRepository.findById).toHaveBeenCalledWith("log1");
    expect(result).toEqual(mockLog);
  });

  it("should throw NotFoundError if log doesn't exist", async () => {
    mockTravelLogRepository.findById.mockResolvedValue(null);

    await expect(getTravelLog.execute("nonexistent")).rejects.toThrow(NotFoundError);
  });
});