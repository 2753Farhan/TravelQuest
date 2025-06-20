// src/interface/controllers/PlaceController.ts
import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreatePlace } from "../../use-cases/places/CreatePlace";
import { GetPlaceById } from "../../use-cases/places/GetPlaceById";
import { GetPlaces } from "../../use-cases/places/GetPlaces";
import { SearchPlaces } from "../../use-cases/places/SearchPlaces";
import { CreatePlaceDto, PlaceResponseDto } from "../dto/CreatePlaceDto";
import { BadRequestError } from "../errors/BadRequestError";

export class PlaceController {
  constructor(
    private readonly createPlace: CreatePlace,
    private readonly getPlaceById: GetPlaceById,
    private readonly getPlaces: GetPlaces,
    private readonly searchPlaces: SearchPlaces
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

  async search(req: Request, res: Response): Promise<void> {
    const query = req.query.q as string;
    if (!query) {
      throw new BadRequestError("Search query parameter 'q' is required");
    }

    const places = await this.searchPlaces.execute(query);
    res.json(places.map(PlaceResponseDto.fromDomain));
  }
}