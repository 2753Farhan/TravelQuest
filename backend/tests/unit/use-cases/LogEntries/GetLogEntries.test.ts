import { GetLogEntries } from "../../../../src/use-cases/LogEntries/GetLogEntries";
import { LogEntryRepository } from "../../../../src/domain/interfaces/logEntryRepository";
import { LogEntry } from "../../../../src/domain/entities/LogEntry";

describe("GetLogEntries", () => {
  let getLogEntries: GetLogEntries;
  let mockLogEntryRepository: jest.Mocked<LogEntryRepository>;

  beforeEach(() => {
    mockLogEntryRepository = {
      findByLogId: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findByIdWithExtendedEntities: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      validateReference: jest.fn(),
    } as any;

    getLogEntries = new GetLogEntries(mockLogEntryRepository);
  });

  it("should return all log entries for a log", async () => {
    const mockEntries = [
      new LogEntry("entry1", "log1", "place1", null, "Entry 1", 10, "1 hour", 2, 4, {}, new Date()),
      new LogEntry("entry2", "log1", null, "route1", "Entry 2", 20, "2 hours", 1, 5, {}, new Date()),
    ];

    mockLogEntryRepository.findByLogId.mockResolvedValue(mockEntries);

    const result = await getLogEntries.execute("log1");

    expect(mockLogEntryRepository.findByLogId).toHaveBeenCalledWith("log1");
    expect(result).toEqual(mockEntries);
    expect(result.length).toBe(2);
  });

  it("should return empty array if log has no entries", async () => {
    mockLogEntryRepository.findByLogId.mockResolvedValue([]);

    const result = await getLogEntries.execute("log2");

    expect(result).toEqual([]);
  });
});