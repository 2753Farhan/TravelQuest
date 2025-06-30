import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreatePlaceDto, PlaceResponseDto } from "../dto/CreatePlaceDto.ts";
import { BadRequestError } from "../errors/BadRequestError.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";
import { CreatePlace } from "../../use-cases/places/CreatePlace.ts";
import { GetPlaceById } from "../../use-cases/places/GetPlaceById.ts";
import { GetPlaces } from "../../use-cases/places/GetPlaces.ts";
import { FindPlacesByType } from "../../use-cases/places/FindPlacesByType.ts";
import { SearchPlacesByName } from "../../use-cases/places/SearchPlacesByName.ts";
import { FindNearbyPlaces } from "../../use-cases/places/FindNearbyPlaces.ts";
import { UpdatePlace } from "../../use-cases/places/UpdatePlace.ts";
import { DeletePlace } from "../../use-cases/places/DeletePlace.ts";

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
    
    if (!place) {
      throw new NotFoundError(`Place with ID ${req.params.id} not found`);
    }
    
    res.json(PlaceResponseDto.fromDomain(place));
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    const places = await this.getPlaces.execute();
    
    if (!places || places.length === 0) {
      throw new NotFoundError("No places found");
    }
    
    res.json(places.map(PlaceResponseDto.fromDomain));
  }

  async getByType(req: Request, res: Response): Promise<void> {
    const places = await this.findPlacesByType.execute(req.params.type);
    
    if (!places || places.length === 0) {
      throw new NotFoundError(`No places found for type ${req.params.type}`);
    }
    
    res.json(places.map(PlaceResponseDto.fromDomain));
  }

  async search(req: Request, res: Response): Promise<void> {
    const query = req.query.q as string;
    
    if (!query) {
      throw new BadRequestError("Search query parameter 'q' is required");
    }

    const places = await this.searchPlacesByName.execute(query);
    
    if (!places || places.length === 0) {
      throw new NotFoundError(`No places found matching "${query}"`);
    }
    
    res.json(places.map(PlaceResponseDto.fromDomain));
  }

  async nearby(req: Request, res: Response): Promise<void> {
    const { x, y, radius } = req.query;
    
    if (!x || !y || !radius) {
      throw new BadRequestError("x, y, and radius parameters are required");
    }

    const xNum = parseFloat(x as string);
    const yNum = parseFloat(y as string);
    const radiusNum = parseFloat(radius as string);
    
    if (isNaN(xNum) || isNaN(yNum) || isNaN(radiusNum)) {
      throw new BadRequestError("x, y, and radius must be valid numbers");
    }

    const places = await this.findNearbyPlaces.execute(
      { x: xNum, y: yNum },
      radiusNum
    );
    
    if (!places || places.length === 0) {
      throw new NotFoundError("No places found nearby");
    }
    
    res.json(places.map(PlaceResponseDto.fromDomain));
  }

  async update(req: Request, res: Response): Promise<void> {
    const updates = req.body;
    
    if (!updates || Object.keys(updates).length === 0) {
      throw new BadRequestError("No update data provided");
    }

    try {
      const updatedPlace = await this.updatePlace.execute(req.params.id, updates);
      res.json(PlaceResponseDto.fromDomain(updatedPlace));
    } catch (error : any) {
      if (error instanceof NotFoundError) {
        throw error; // Let the error propagate to the error handler
      }
      throw new BadRequestError(error.message);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    const deleted = await this.deletePlace.execute(req.params.id);
    
    if (!deleted) {
      throw new NotFoundError(`Place with ID ${req.params.id} not found`);
    }
    
    res.status(204).send();
  }
}