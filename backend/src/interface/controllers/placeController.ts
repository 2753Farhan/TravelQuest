// src/interface/controllers/PlaceController.ts
import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreatePlaceDto, PlaceResponseDto } from "../dto/CreatePlaceDto";
import { BadRequestError } from "../errors/BadRequestError";
import { CreatePlace } from "../../use-cases/places/CreatePlace";
import { GetPlaceById } from "../../use-cases/places/GetPlaceById";
import { GetPlaces } from "../../use-cases/places/GetPlaces";
import { FindPlacesByType } from "../../use-cases/places/FindPlacesByType";
import { SearchPlacesByName } from "../../use-cases/places/SearchPlacesByName";
import { FindNearbyPlaces } from "../../use-cases/places/FindNearbyPlaces";
import { UpdatePlace } from "../../use-cases/places/UpdatePlace";
import { DeletePlace } from "../../use-cases/places/DeletePlace";
export class PlaceController {
  constructor(
    private readonly createPlace: CreatePlace,
    private readonly getPlaceById: GetPlaceById,
    private readonly getPlaces: GetPlaces,
    private readonly findPlacesByType: FindPlacesByType,
    private readonly searchPlacesByName: SearchPlacesByName,
    private readonly findNearbyPlaces: FindNearbyPlaces,
    private readonly updatePlace: UpdatePlace,
    private readonly deletePlace: DeletePlace
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const dto = plainToInstance(CreatePlaceDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const message = errors
        .map((e) => Object.values(e.constraints || {}).join(", "))
        .join("; ");
      throw new BadRequestError(message);
    }

    const place = await this.createPlace.execute(dto);
    res.status(201).json(PlaceResponseDto.fromDomain(place));
  }

  async getById(req: Request, res: Response): Promise<void> {
    const place = await this.getPlaceById.execute(req.params.id);
    res.json(PlaceResponseDto.fromDomain(place));
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    const places = await this.getPlaces.execute();
    res.json(places.map(PlaceResponseDto.fromDomain));
  }

  async getByType(req: Request, res: Response): Promise<void> {
    const places = await this.findPlacesByType.execute(req.params.type);
    res.json(places.map(PlaceResponseDto.fromDomain));
  }

  async search(req: Request, res: Response): Promise<void> {
    const query = req.query.q as string;
    if (!query) {
      throw new BadRequestError("Search query parameter 'q' is required");
    }

    const places = await this.searchPlacesByName.execute(query);
    res.json(places.map(PlaceResponseDto.fromDomain));
  }

  async nearby(req: Request, res: Response): Promise<void> {
    const { x, y, radius } = req.query;
    if (!x || !y || !radius) {
      throw new BadRequestError("x, y, and radius parameters are required");
    }

    const places = await this.findNearbyPlaces.execute(
      { 
        x: parseFloat(x as string), 
        y: parseFloat(y as string) 
      },
      parseFloat(radius as string)
    );
    res.json(places.map(PlaceResponseDto.fromDomain));
  }

  async update(req: Request, res: Response): Promise<void> {
    const updates = req.body;
    const place = await this.updatePlace.execute(req.params.id, updates);
    res.json(PlaceResponseDto.fromDomain(place));
  }

  async delete(req: Request, res: Response): Promise<void> {
    await this.deletePlace.execute(req.params.id);
    res.status(204).send();
  }
}