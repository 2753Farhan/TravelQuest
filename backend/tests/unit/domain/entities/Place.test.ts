import {Place} from "../../../../src/domain/entities/Place"
import { PlaceTypes } from "../../../../src/shared/types";

describe("Place Entity", () => {
  const mockPlaceData = {
    place_id: "123",
    type: PlaceTypes.ATTRACTION,
    name: "Eiffel Tower",
    geo_coordinates: { x: 2.2945, y: 48.8584 },
    address: "Champ de Mars, 5 Av. Anatole France, 75007 Paris, France",
    details: { description: "Iconic tower in Paris" },
    created_at: new Date(),
    updated_at: new Date()
  };

  describe("Constructor", () => {
    it("should create a place instance with all properties", () => {
      const place = new Place(
        mockPlaceData.place_id,
        mockPlaceData.type,
        mockPlaceData.name,
        mockPlaceData.geo_coordinates,
        mockPlaceData.address,
        mockPlaceData.details,
        mockPlaceData.created_at,
        mockPlaceData.updated_at
      );

      expect(place).toBeInstanceOf(Place);
      expect(place.place_id).toBe(mockPlaceData.place_id);
      expect(place.type).toBe(mockPlaceData.type);
      expect(place.name).toBe(mockPlaceData.name);
      expect(place.geo_coordinates).toEqual(mockPlaceData.geo_coordinates);
      expect(place.address).toBe(mockPlaceData.address);
      expect(place.details).toEqual(mockPlaceData.details);
      expect(place.created_at).toBe(mockPlaceData.created_at);
      expect(place.updated_at).toBe(mockPlaceData.updated_at);
    });

    it("should create a place instance with optional properties", () => {
      const place = new Place(
        mockPlaceData.place_id,
        mockPlaceData.type,
        mockPlaceData.name,
        mockPlaceData.geo_coordinates
      );

      expect(place.address).toBeUndefined();
      expect(place.details).toEqual({});
      expect(place.updated_at).toBeUndefined();
    });
  });

  describe("fromRaw", () => {
    it("should create a place from raw database data", () => {
      const rawData = {
        place_id: "123",
        type: "attraction",
        name: "Eiffel Tower",
        x: 2.2945,
        y: 48.8584,
        address: "Paris address",
        details: { key: "value" },
        created_at: new Date(),
        updated_at: new Date()
      };

      const place = Place.fromRaw(rawData);

      expect(place).toBeInstanceOf(Place);
      expect(place.place_id).toBe(rawData.place_id);
      expect(place.type).toBe(rawData.type);
      expect(place.name).toBe(rawData.name);
      expect(place.geo_coordinates).toEqual({ x: rawData.x, y: rawData.y });
      expect(place.address).toBe(rawData.address);
      expect(place.details).toEqual(rawData.details);
    });

    it("should handle missing coordinates gracefully", () => {
      const rawData = {
        place_id: "123",
        type: "attraction",
        name: "Eiffel Tower",
        longitude: 2.2945,
        latitude: 48.8584
      };

      const place = Place.fromRaw(rawData);

      expect(place.geo_coordinates).toEqual({ x: 2.2945, y: 48.8584 });
    });

    it("should default coordinates to 0,0 if none provided", () => {
      const rawData = {
        place_id: "123",
        type: "attraction",
        name: "Eiffel Tower"
      };

      const place = Place.fromRaw(rawData);

      expect(place.geo_coordinates).toEqual({ x: 0, y: 0 });
    });
  });
});