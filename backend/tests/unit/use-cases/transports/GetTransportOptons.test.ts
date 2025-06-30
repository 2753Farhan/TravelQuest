import { GetTransportOptions } from "../../../../src/use-cases/transorts/GetTransportOptons";
import { TransportRepository } from "../../../../src/domain/interfaces/transportRepository";
import { TransportOption } from "../../../../src/domain/entities/TransportOption";

describe("GetTransportOptions", () => {
  let getTransportOptions: GetTransportOptions;
  let mockTransportRepository: jest.Mocked<TransportRepository>;

  beforeEach(() => {
    mockTransportRepository = {
      findAllOptions: jest.fn(),
      createOption: jest.fn(),
      findOptionById: jest.fn(),
      createRoute: jest.fn(),
      findRouteById: jest.fn(),
      findRoutesBetweenPlaces: jest.fn(),
    } as any;

    getTransportOptions = new GetTransportOptions(mockTransportRepository);
  });

  it("should return all transport options", async () => {
    const mockOptions = [
      new TransportOption("trans1", "flight", "Delta", {}, new Date()),
      new TransportOption("trans2", "train", "Amtrak", {}, new Date()),
    ];

    mockTransportRepository.findAllOptions.mockResolvedValue(mockOptions);

    const result = await getTransportOptions.execute();

    expect(mockTransportRepository.findAllOptions).toHaveBeenCalled();
    expect(result).toEqual(mockOptions);
    expect(result.length).toBe(2);
  });

  it("should return empty array if no options exist", async () => {
    mockTransportRepository.findAllOptions.mockResolvedValue([]);

    const result = await getTransportOptions.execute();

    expect(result).toEqual([]);
  });
});