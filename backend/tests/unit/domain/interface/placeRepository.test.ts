import { Place } from "../../../../src/domain/entities/Place";
import { PlaceRepository } from "../../../../src/domain/interfaces/placeRepository";
import { PlaceTypes } from "../../../../src/shared/types";

describe("PlaceRepository Interface", () => {
  let mockRepository: jest.Mocked<PlaceRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByType: jest.fn(),
      searchByName: jest.fn(),
      searchNearby: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
  });

  const mockPlace: Place = {
    place_id: "1",
    type: PlaceTypes.ATTRACTION,
    name: "Test Place",
    geo_coordinates: { x: 0, y: 0 },
    created_at: new Date()
  } as Place;

  it("should define create method", async () => {
    mockRepository.create.mockResolvedValue(mockPlace);
    const result = await mockRepository.create({
        type: PlaceTypes.ATTRACTION,
        name: "Test Place",
        geo_coordinates: { x: 0, y: 0 },
        details: {}
    });
    expect(result).toEqual(mockPlace);
    expect(mockRepository.create).toHaveBeenCalled();
  });

  it("should define findById method", async () => {
    mockRepository.findById.mockResolvedValue(mockPlace);
    const result = await mockRepository.findById("1");
    expect(result).toEqual(mockPlace);
    expect(mockRepository.findById).toHaveBeenCalledWith("1");
  });

  it("should define findAll method", async () => {
    mockRepository.findAll.mockResolvedValue([mockPlace]);
    const result = await mockRepository.findAll();
    expect(result).toEqual([mockPlace]);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it("should define findByType method", async () => {
    mockRepository.findByType.mockResolvedValue([mockPlace]);
    const result = await mockRepository.findByType(PlaceTypes.ATTRACTION);
    expect(result).toEqual([mockPlace]);
    expect(mockRepository.findByType).toHaveBeenCalledWith(PlaceTypes.ATTRACTION);
  });

  it("should define searchByName method", async () => {
    mockRepository.searchByName.mockResolvedValue([mockPlace]);
    const result = await mockRepository.searchByName("test");
    expect(result).toEqual([mockPlace]);
    expect(mockRepository.searchByName).toHaveBeenCalledWith("test");
  });

  it("should define searchNearby method", async () => {
    mockRepository.searchNearby.mockResolvedValue([mockPlace]);
    const result = await mockRepository.searchNearby({ x: 0, y: 0 }, 1000);
    expect(result).toEqual([mockPlace]);
    expect(mockRepository.searchNearby).toHaveBeenCalledWith({ x: 0, y: 0 }, 1000);
  });

  it("should define update method", async () => {
    mockRepository.update.mockResolvedValue(mockPlace);
    const result = await mockRepository.update("1", { name: "Updated" });
    expect(result).toEqual(mockPlace);
    expect(mockRepository.update).toHaveBeenCalledWith("1", { name: "Updated" });
  });

  it("should define delete method", async () => {
    mockRepository.delete.mockResolvedValue(true);
    const result = await mockRepository.delete("1");
    expect(result).toBe(true);
    expect(mockRepository.delete).toHaveBeenCalledWith("1");
  });
});