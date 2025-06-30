import { FindTransportRoutes } from "../../../../src/use-cases/transorts/FindTransportrRotes";
import { TransportRepository } from "../../../../src/domain/interfaces/transportRepository";
import { TransportRoute } from "../../../../src/domain/entities/TransportRoute";

describe("FindTransportRoutes", () => {
  let findTransportRoutes: FindTransportRoutes;
  let mockTransportRepository: jest.Mocked<TransportRepository>;

  beforeEach(() => {
    mockTransportRepository = {
      findRoutesBetweenPlaces: jest.fn(),
      createOption: jest.fn(),
      findOptionById: jest.fn(),
      findAllOptions: jest.fn(),
      createRoute: jest.fn(),
      findRouteById: jest.fn(),
    } as any;

    findTransportRoutes = new FindTransportRoutes(mockTransportRepository);
  });

  it("should find routes between places", async () => {
    const mockRoutes = [
      new TransportRoute("route1", "trans1", "place1", "place2", 100, "1 hour", {}, new Date()),
      new TransportRoute("route2", "trans2", "place1", "place2", 150, "45 min", {}, new Date()),
    ];

    mockTransportRepository.findRoutesBetweenPlaces.mockResolvedValue(mockRoutes);

    const result = await findTransportRoutes.execute("place1", "place2");

    expect(mockTransportRepository.findRoutesBetweenPlaces).toHaveBeenCalledWith(
      "place1",
      "place2"
    );
    expect(result).toEqual(mockRoutes);
    expect(result.length).toBe(2);
  });

  it("should return empty array if no routes found", async () => {
    mockTransportRepository.findRoutesBetweenPlaces.mockResolvedValue([]);

    const result = await findTransportRoutes.execute("place1", "place3");

    expect(result).toEqual([]);
  });
});