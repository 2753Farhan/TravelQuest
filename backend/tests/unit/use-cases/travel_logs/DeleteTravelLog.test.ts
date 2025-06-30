import { DeleteTravelLog } from "../../../../src/use-cases/travel_logs/DeleteTravelLog";
import { TravelLogRepository } from "../../../../src/domain/interfaces/travelLogRepository";
import { NotFoundError } from "../../../../src/interface/errors/NotFoundError";

describe("DeleteTravelLog", () => {
  let deleteTravelLog: DeleteTravelLog;
  let mockTravelLogRepository: jest.Mocked<TravelLogRepository>;

  beforeEach(() => {
    mockTravelLogRepository = {
      delete: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      findByCreator: jest.fn(),
      update: jest.fn(),
    } as any;

    deleteTravelLog = new DeleteTravelLog(mockTravelLogRepository);
  });

  it("should delete a travel log", async () => {
    mockTravelLogRepository.delete.mockResolvedValue(true);

    const result = await deleteTravelLog.execute("log1");

    expect(mockTravelLogRepository.delete).toHaveBeenCalledWith("log1");
    expect(result).toBe(true);
  });

  it("should throw NotFoundError if log doesn't exist", async () => {
    mockTravelLogRepository.delete.mockRejectedValue(new NotFoundError("Travel log not found"));

    await expect(deleteTravelLog.execute("nonexistent")).rejects.toThrow(NotFoundError);
  });

  it("should return false if deletion fails silently", async () => {
    mockTravelLogRepository.delete.mockResolvedValue(false);

    const result = await deleteTravelLog.execute("log1");

    expect(result).toBe(false);
  });
});