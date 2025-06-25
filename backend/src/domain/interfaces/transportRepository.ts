import { TransportOption } from "../entities/TransportOption";
import { TransportRoute } from "../entities/TransportRoute";

export interface TransportRepository {

  createOption(option: Omit<TransportOption, 'transport_id' | 'created_at' | 'updated_at'>): Promise<TransportOption>;
  findOptionById(id: string): Promise<TransportOption | null>;
  findAllOptions(): Promise<TransportOption[]>;

  createRoute(route: Omit<TransportRoute, 'route_id' | 'created_at' | 'updated_at'>): Promise<TransportRoute>;
  findRouteById(id: string): Promise<TransportRoute | null>;
  findRoutesBetweenPlaces(startId: string, endId: string): Promise<TransportRoute[]>;
}