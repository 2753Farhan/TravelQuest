import { PlaceTypes } from "../../shared/types";

export class PlaceEntity {
    constructor(
        public readonly placeId: string,
        public type: PlaceTypes,
        public name: string,
        public geoCordinates: {
            latitude: number;
            longitude: number;
        },
        public address:string,
        public details: string,
        public readonly createdAt: Date = new Date(),
        public updatedAt?: Date,
        ){}
}