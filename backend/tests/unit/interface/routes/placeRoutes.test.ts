// tests/unit/interface/routes/placeRoutes.test.ts
import request from "supertest";
import express from "express";
import placeRoutes from "../../../../src/interface/routes/placeRoutes";
import { PlaceController } from "../../../../src/interface/controllers/placeController";
import { CreatePlace } from "../../../../src/use-cases/places/CreatePlace";
import { GetPlaceById } from "../../../../src/use-cases/places/GetPlaceById";
import { GetPlaces } from "../../../../src/use-cases/places/GetPlaces";
import { FindPlacesByType } from "../../../../src/use-cases/places/FindPlacesByType";
import { SearchPlacesByName } from "../../../../src/use-cases/places/SearchPlacesByName";
import { FindNearbyPlaces } from "../../../../src/use-cases/places/FindNearbyPlaces";
import { UpdatePlace } from "../../../../src/use-cases/places/UpdatePlace";
import { DeletePlace } from "../../../../src/use-cases/places/DeletePlace";

describe("Place Routes", () => {
  let app: express.Express;
  let mockCreatePlace: jest.Mocked<CreatePlace>;
  let mockGetPlaceById: jest.Mocked<GetPlaceById>;
  let mockGetPlaces: jest.Mocked<GetPlaces>;
  let mockFindPlacesByType: jest.Mocked<FindPlacesByType>;
  let mockSearchPlacesByName: jest.Mocked<SearchPlacesByName>;
  let mockFindNearbyPlaces: jest.Mocked<FindNearbyPlaces>;
  let mockUpdatePlace: jest.Mocked<UpdatePlace>;
  let mockDeletePlace: jest.Mocked<DeletePlace>;
  let controller: PlaceController;

  beforeEach(() => {
    // Create mock implementations for all use cases
    mockCreatePlace = {
      execute: jest.fn().mockResolvedValue({
        place_id: "123",
        name: "Test Place",
        geo_coordinates: { x: 0, y: 0 },
        created_at: new Date()
      })
    } as unknown as jest.Mocked<CreatePlace>;

    mockGetPlaceById = {
      execute: jest.fn().mockResolvedValue({
        place_id: "123",
        name: "Test Place",
        geo_coordinates: { x: 0, y: 0 },
        created_at: new Date()
      })
    } as unknown as jest.Mocked<GetPlaceById>;

    mockGetPlaces = {
      execute: jest.fn().mockResolvedValue([{
        place_id: "123",
        name: "Test Place",
        geo_coordinates: { x: 0, y: 0 },
        created_at: new Date()
      }])
    } as unknown as jest.Mocked<GetPlaces>;

    mockFindPlacesByType = {
      execute: jest.fn().mockResolvedValue([{
        place_id: "123",
        name: "Test Place",
        type: "attraction",
        geo_coordinates: { x: 0, y: 0 },
        created_at: new Date()
      }])
    } as unknown as jest.Mocked<FindPlacesByType>;

    mockSearchPlacesByName = {
      execute: jest.fn().mockResolvedValue([{
        place_id: "123",
        name: "Test Place",
        geo_coordinates: { x: 0, y: 0 },
        created_at: new Date()
      }])
    } as unknown as jest.Mocked<SearchPlacesByName>;

    mockFindNearbyPlaces = {
      execute: jest.fn().mockResolvedValue([{
        place_id: "123",
        name: "Test Place",
        geo_coordinates: { x: 0, y: 0 },
        created_at: new Date()
      }])
    } as unknown as jest.Mocked<FindNearbyPlaces>;

    mockUpdatePlace = {
      execute: jest.fn().mockResolvedValue({
        place_id: "123",
        name: "Updated Place",
        geo_coordinates: { x: 0, y: 0 },
        created_at: new Date()
      })
    } as unknown as jest.Mocked<UpdatePlace>;

    mockDeletePlace = {
      execute: jest.fn().mockResolvedValue(true)
    } as unknown as jest.Mocked<DeletePlace>;

    // Create controller with mocked use cases
    controller = new PlaceController(
      mockCreatePlace,
      mockGetPlaceById,
      mockGetPlaces,
      mockFindPlacesByType,
      mockSearchPlacesByName,
      mockFindNearbyPlaces,
      mockUpdatePlace,
      mockDeletePlace
    );

    // Initialize express app and routes
    app = express();
    app.use(express.json());
    app.use("/", placeRoutes(
      controller.create.bind(controller),
      controller.getById.bind(controller),
      controller.getAll.bind(controller),
      controller.getByType.bind(controller),
      controller.search.bind(controller),
      controller.nearby.bind(controller),
      controller.update.bind(controller),
      controller.delete.bind(controller)
    ));
  });

  describe("POST /", () => {
    it("should create a place", async () => {
      const placeData = {
        type: "attraction",
        name: "Eiffel Tower",
        x: 2.2945,
        y: 48.8584
      };

      const response = await request(app)
        .post("/")
        .send(placeData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        place_id: "123",
        name: "Test Place"
      });
      expect(mockCreatePlace.execute).toHaveBeenCalledWith(placeData);
    });
  });

  describe("GET /:id", () => {
    it("should get a place by id", async () => {
      const response = await request(app)
        .get("/123");

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        place_id: "123",
        name: "Test Place"
      });
      expect(mockGetPlaceById.execute).toHaveBeenCalledWith("123");
    });
  });

  describe("GET /type/:type", () => {
    it("should get places by type", async () => {
      const response = await request(app)
        .get("/type/attraction");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toMatchObject({
        place_id: "123",
        name: "Test Place",
        type: "attraction"
      });
      expect(mockFindPlacesByType.execute).toHaveBeenCalledWith("attraction");
    });
  });

  // Add similar tests for other routes...
});