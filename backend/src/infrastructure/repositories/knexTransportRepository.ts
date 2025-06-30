
import { db } from "../database/knex/knexfile.ts";
import { TransportOption } from "../../domain/entities/TransportOption.ts";
import { TransportRoute } from "../../domain/entities/TransportRoute.ts";
import { TransportRepository } from "../../domain/interfaces/transportRepository.ts";
import { BadRequestError } from "../../interface/errors/BadRequestError.ts";

export class KnexTransportRepository implements TransportRepository {

  async createOption(option: Omit<TransportOption, 'transport_id' | 'created_at' | 'updated_at'>): Promise<TransportOption> {
    try {
      const [result] = await db('transport_options')
        .insert({
          transport_type: option.transport_type,
          provider: option.provider,
          details: option.details
        })
        .returning('*');
      return TransportOption.fromRaw(result);
    } catch (error: any) {
      throw new BadRequestError(`Failed to create transport option: ${error.message}`);
    }
  }

  async findOptionById(id: string): Promise<TransportOption | null> {
    const option = await db('transport_options')
      .where('transport_id', id)
      .first();
    return option ? TransportOption.fromRaw(option) : null;
  }

  async findAllOptions(): Promise<TransportOption[]> {
    const options = await db('transport_options').select('*');
    return options.map(TransportOption.fromRaw);
  }


  async createRoute(route: Omit<TransportRoute, 'route_id' | 'created_at' | 'updated_at'>): Promise<TransportRoute> {
    try {
      const [result] = await db('transport_routes')
        .insert({
          transport_id: route.transport_id,
          start_place_id: route.start_place_id,
          end_place_id: route.end_place_id,
          cost: route.cost,
          duration: route.duration,
          details: route.details
        })
        .returning('*');
      return TransportRoute.fromRaw(result);
    } catch (error : any) {
      throw new BadRequestError(`Failed to create transport route: ${error.message}`);
    }
  }

  async findRouteById(id: string): Promise<TransportRoute | null> {
    const route = await db('transport_routes')
      .where('route_id', id)
      .first();
    return route ? TransportRoute.fromRaw(route) : null;
  }

  async findRoutesBetweenPlaces(startId: string, endId: string): Promise<TransportRoute[]> {
    const routes = await db('transport_routes')
      .where('start_place_id', startId)
      .where('end_place_id', endId)
      .select('*');
    return routes.map(TransportRoute.fromRaw);
  }
}