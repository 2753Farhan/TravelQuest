import { TransportRoute } from "../../domain/entities/TransportRoute";
import { TransportRepository } from "../../domain/interfaces/transportRepository";
import { CreateTransportRouteDto } from "../../interface/dto/CreateTransportRouteDto";

export class CreateTransportRoute {
  constructor(private readonly transportRepo: TransportRepository) {}

  async execute(data: CreateTransportRouteDto): Promise<TransportRoute> {
    return this.transportRepo.createRoute({
      transport_id: data.transport_id,
      start_place_id: data.start_place_id,
      end_place_id: data.end_place_id || null,
      cost: data.cost || null,
      duration: data.duration || null,
      details: data.details || {}
    });
  }
}