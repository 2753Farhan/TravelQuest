import { CreatePlaceDto, PlaceResponseDto } from "../../../../src/interface/dto/CreatePlaceDto";
import { validate } from "class-validator";
import { PlaceTypes } from "../../../../src/shared/types";

describe("CreatePlaceDto", () => {
  it("should validate with correct data", async () => {
    const dto = new CreatePlaceDto();
    dto.type = PlaceTypes.ATTRACTION;
    dto.name = "Eiffel Tower";
    dto.x = 2.2945;
    dto.y = 48.8584;
    dto.address = "Paris address";
    dto.details = { description: "Iconic tower" };

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it("should fail validation with missing required fields", async () => {
    const dto = new CreatePlaceDto();
    
    const errors = await validate(dto);
    expect(errors.length).toBe(4); // type, name, x, y
    expect(errors[0].property).toBe("type");
    expect(errors[1].property).toBe("name");
    expect(errors[2].property).toBe("x");
    expect(errors[3].property).toBe("y");
  });

  it("should fail validation with invalid type", async () => {
    const dto = new CreatePlaceDto();
    dto.type = "invalid_type" as any;
    dto.name = "Eiffel Tower";
    dto.x = 2.2945;
    dto.y = 48.8584;

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe("type");
  });

  it("should pass validation with optional fields missing", async () => {
    const dto = new CreatePlaceDto();
    dto.type = PlaceTypes.ATTRACTION;
    dto.name = "Eiffel Tower";
    dto.x = 2.2945;
    dto.y = 48.8584;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});

describe("PlaceResponseDto", () => {
  it("should create from domain model correctly", () => {
    const place = {
      place_id: "123",
      type: "attraction",
      name: "Eiffel Tower",
      geo_coordinates: { x: 2.2945, y: 48.8584 },
      address: "Paris address",
      details: { key: "value" },
      created_at: new Date(),
      updated_at: new Date()
    } as any;

    const dto = PlaceResponseDto.fromDomain(place);

    expect(dto.place_id).toBe(place.place_id);
    expect(dto.type).toBe(place.type);
    expect(dto.name).toBe(place.name);
    expect(dto.coordinates).toEqual({ x: place.geo_coordinates.x, y: place.geo_coordinates.y });
    expect(dto.address).toBe(place.address);
    expect(dto.details).toEqual(place.details);
    expect(dto.created_at).toBe(place.created_at);
    expect(dto.updated_at).toBe(place.updated_at);
  });
});