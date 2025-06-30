import { CreatePlace } from "../../../../src/use-cases/places/CreatePlace";
import { PlaceRepository } from "../../../../src/domain/interfaces/placeRepository";
import { Place } from "../../../../src/domain/entities/Place";
import { PlaceTypes } from "../../../../src/shared/types";

describe("CreatePlace Use Case", () => {
  let mockRepository: jest.Mocked<PlaceRepository>;
  let createPlace: CreatePlace;

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

    createPlace = new CreatePlace(mockRepository);
  });

  const mockPlaceData = {
    type: PlaceTypes.ATTRACTION,
    name: "Eiffel Tower",
    x: 2.2945,
    y: 48.8584,
    address: "Paris address",
    details: { description: "Iconic tower" }
  };

  const mockCreatedPlace = new Place(
    "123",
    mockPlaceData.type,
    mockPlaceData.name,
    { x: mockPlaceData.x, y: mockPlaceData.y },
    mockPlaceData.address,
    mockPlaceData.details,
    new Date()
  );

  it("should create a new place", async () => {
    mockRepository.create.mockResolvedValue(mockCreatedPlace);

    const result = await createPlace.execute(mockPlaceData);

    expect(result).toEqual(mockCreatedPlace);
    expect(mockRepository.create).toHaveBeenCalledWith({
      type: mockPlaceData.type,
      name: mockPlaceData.name,
      geo_coordinates: { x: mockPlaceData.x, y: mockPlaceData.y },
      address: mockPlaceData.address,
      details: mockPlaceData.details
    });
  });

  it("should handle optional fields", async () => {
    const minimalPlaceData = {
      type: mockPlaceData.type,
      name: mockPlaceData.name,
      x: mockPlaceData.x,
      y: mockPlaceData.y
    };

    mockRepository.create.mockResolvedValue(mockCreatedPlace);

    const result = await createPlace.execute(minimalPlaceData);

    expect(result).toEqual(mockCreatedPlace);
    expect(mockRepository.create).toHaveBeenCalledWith({
      type: minimalPlaceData.type,
      name: minimalPlaceData.name,
      geo_coordinates: { x: minimalPlaceData.x, y: minimalPlaceData.y },
      address: undefined,
      details: {}
    });
  });
});