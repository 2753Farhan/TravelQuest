import { TripItem } from "../../domain/entities/TravelGroup";
import { TravelGroupRepository } from "../../domain/interfaces/travelGroupRepository";

export class findProximityItems  {
 
    constructor(private readonly repository: TravelGroupRepository) {}

    async execute( groupId: string,  point: { x: number; y: number }, radius: number): Promise<any>  {
    const items = await this.repository.CurrentLocationProximityItem(groupId, point, radius);
    return items ;
    }

}
