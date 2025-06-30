import { Router } from "express";
import { PlaceController } from "../controllers/placeController";
import { KnexPlaceRepository } from "../../infrastructure/repositories/knexPlaceRepository";
import { CreatePlace } from "../../use-cases/places/CreatePlace";
import { GetPlaceById } from "../../use-cases/places/GetPlaceById";
import { GetPlaces } from "../../use-cases/places/GetPlaces";
import { FindPlacesByType } from "../../use-cases/places/FindPlacesByType";
import { SearchPlacesByName } from "../../use-cases/places/SearchPlacesByName";
import { FindNearbyPlaces } from "../../use-cases/places/FindNearbyPlaces";
import { UpdatePlace } from "../../use-cases/places/UpdatePlace";
import { DeletePlace } from "../../use-cases/places/DeletePlace";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();
const placeRepository = new KnexPlaceRepository();


const createPlace = new CreatePlace(placeRepository);
const getPlaceById = new GetPlaceById(placeRepository);
const getPlaces = new GetPlaces(placeRepository);
const findPlacesByType = new FindPlacesByType(placeRepository);
const searchPlacesByName = new SearchPlacesByName(placeRepository);
const findNearbyPlaces = new FindNearbyPlaces(placeRepository);
const updatePlace = new UpdatePlace(placeRepository);
const deletePlace = new DeletePlace(placeRepository);


const placeController = new PlaceController(
  createPlace,
  getPlaceById,
  getPlaces,
  findPlacesByType,
  searchPlacesByName,
  findNearbyPlaces,
  updatePlace,
  deletePlace
);


router.post("/", asyncHandler(placeController.create.bind(placeController)));
router.get("/", asyncHandler(placeController.getAll.bind(placeController)));
router.get("/search", asyncHandler(placeController.search.bind(placeController)));
router.get("/nearby", asyncHandler(placeController.nearby.bind(placeController)));
router.get("/type/:type", asyncHandler(placeController.getByType.bind(placeController)));
router.get("/:id", asyncHandler(placeController.getById.bind(placeController)));
router.patch("/:id", asyncHandler(placeController.update.bind(placeController)));
router.delete("/:id", asyncHandler(placeController.delete.bind(placeController)));

export default router;