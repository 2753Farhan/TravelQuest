import { TransportOption } from "../entities/TransportOption.ts";
import { TransportRoute } from "../entities/TransportRoute.ts";

export interface TransportRepository {

  createOption(option: Omit<TransportOption, 'transport_id' | 'created_at' | 'updated_at'>): Promise<TransportOption>;
  findOptionById(id: string): Promise<TransportOption | null>;
  findAllOptions(): Promise<TransportOption[]>;

  createRoute(route: Omit<TransportRoute, 'route_id' | 'created_at' | 'updated_at'>): Promise<TransportRoute>;
  findRouteById(id: string): Promise<TransportRoute | null>;
  findRoutesBetweenPlaces(startId: string, endId: string): Promise<TransportRoute[]>;
}