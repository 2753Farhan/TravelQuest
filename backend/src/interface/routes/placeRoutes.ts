// src/interface/routes/placeRoutes.ts
import { Router } from "express";
import { PlaceController } from "../controllers/placeController";
import { KnexPlaceRepository } from "../../infrastructure/repositories/knexPlaceRepocitory";
import { CreatePlace } from "../../use-cases/places/CreatePlace";
import { GetPlaceById } from "../../use-cases/places/GetPlaceById";
import { GetPlaces } from "../../use-cases/places/GetPlaces";
import { SearchPlaces } from "../../use-cases/places/SearchPlaces";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();

const placeRepository = new KnexPlaceRepository();
const createPlace = new CreatePlace(placeRepository);
const getPlaceById = new GetPlaceById(placeRepository);
const getPlaces = new GetPlaces(placeRepository);
const searchPlaces = new SearchPlaces(placeRepository);

const placeController = new PlaceController(
  createPlace,
  getPlaceById,
  getPlaces,
  searchPlaces
);

router.post("/", asyncHandler(placeController.create.bind(placeController)));
router.get("/", asyncHandler(placeController.getAll.bind(placeController)));
router.get("/search", asyncHandler(placeController.search.bind(placeController)));
router.get("/:id", asyncHandler(placeController.getById.bind(placeController)));

export default router;