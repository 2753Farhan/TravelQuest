import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateTransportOption } from "../../use-cases/transorts/CreateTransportOptions";
import { CreateTransportRoute } from "../../use-cases/transorts/CreateTransportRoute";
import { FindTransportRoutes } from "../../use-cases/transorts/FindTransportrRotes";
import { GetTransportOptions } from "../../use-cases/transorts/GetTransportOptons";
import { GetTransportById } from "../../use-cases/transorts/GetTransportById";
import { BadRequestError } from "../errors/BadRequestError";
import { CreateTransportOptionDto, TransportOptionResponseDto } from "../dto/CreateTransportOptionDto";
import { CreateTransportRouteDto, TransportRouteResponseDto } from "../dto/CreateTransportRouteDto";
import {FindAllTransportRoutes} from "../../use-cases/transorts/FindAllTransportRoutes";
import { FindTransportRouteByTranportId } from "../../use-cases/transorts/FindTransportRouteByTranportId";
import { FindRouteById } from "../../use-cases/transorts/FindRouteById";

export class TransportController {
  constructor(
    private readonly createTransportOption: CreateTransportOption, 
    private readonly getTransportOptions: GetTransportOptions,
    private readonly getTransportById: GetTransportById,
    private readonly createTransportRoute: CreateTransportRoute,   
    private readonly findTransportRoutes: FindTransportRoutes , 
    private readonly findAllTransportRoutes: FindAllTransportRoutes,
    private readonly findTransportRoutesByTransportId : FindTransportRouteByTranportId,
    private readonly findRouteById : FindRouteById   
  ) {}

  async createOption(req: Request, res: Response) {
    const dto = plainToInstance(CreateTransportOptionDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const message = errors.map(e => Object.values(e.constraints || {})).join('; ');
      throw new BadRequestError(message);
    }

    const option = await this.createTransportOption.execute(dto);
    res.status(201).json(TransportOptionResponseDto.fromDomain(option));
  }

    async findOptions(req: Request, res: Response) {

        const options = await this.getTransportOptions.execute();
        res.json(options.map(TransportOptionResponseDto.fromDomain));
    }

    async findOptionById(req: Request, res: Response) {
        const option = await this.getTransportById.execute(req.params.id);
        if (!option) {
            throw new BadRequestError("Transport option not found");
        }
        res.json(TransportOptionResponseDto.fromDomain(option));      
    }
   


  async createRoute(req: Request, res: Response) {
    const dto = plainToInstance(CreateTransportRouteDto, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const message = errors.map(e => Object.values(e.constraints || {})).join('; ');
      throw new BadRequestError(message);
    }

    const route = await this.createTransportRoute.execute(dto);
    res.status(201).json(TransportRouteResponseDto.fromDomain(route));
  }

  async findRoutes(req: Request, res: Response) {
    const { startId, endId } = req.query;
    
    if (startId || endId) {
        // Handle specific route query
        if (!startId || !endId) {
            throw new BadRequestError("Both startId and endId are required when querying specific routes");
        }
        const routes = await this.findTransportRoutes.execute(startId as string, endId as string);
        res.json(routes.map(TransportRouteResponseDto.fromDomain));
    } else {
        // Handle get all routes case
        const routes = await this.findAllTransportRoutes.execute();
        res.json(routes.map(TransportRouteResponseDto.fromDomain));
    }
  }

  async findAllRoutesByTransportId(req: Request, res: Response){
    const routes = this.findTransportRoutesByTransportId.execute(req.params.id)
    if(!routes) {
      throw new BadRequestError('Failed to get transport routes');
    }

    res.json((await routes).map(TransportRouteResponseDto.fromDomain)); 
  }


  async findRouteByRouteId (req: Request,res: Response){
    const route = await this.findRouteById.execute(req.params.id);
    if(!route) {
      throw new BadRequestError('Failed to get transport routes');
    }
    res.json(TransportRouteResponseDto.fromDomain(route));
  }


   




}