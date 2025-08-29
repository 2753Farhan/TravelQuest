import { Router } from "express";
import { TransportController } from "../controllers/transportController";
import { KnexTransportRepository } from "../../infrastructure/repositories/knexTransportRepository";
import { CreateTransportOption } from "../../use-cases/transorts/CreateTransportOptions";
import { FindTransportRoutes } from "../../use-cases/transorts/FindTransportrRotes";
import { CreateTransportRoute } from "../../use-cases/transorts/CreateTransportRoute";
import { asyncHandler } from "../middlewares/asyncHandler";
import { GetTransportOptions } from "../../use-cases/transorts/GetTransportOptons";
import { GetTransportById } from "../../use-cases/transorts/GetTransportById";

const router = Router();
const transportRepo = new KnexTransportRepository();

const createOption = new CreateTransportOption(transportRepo);
const createRoute = new CreateTransportRoute(transportRepo);
const findRoutes = new FindTransportRoutes(transportRepo);
const getTransportOptions = new GetTransportOptions(transportRepo);
const getTransportById = new GetTransportById(transportRepo);

const transportController = new TransportController(

  createOption,
  getTransportOptions,
  getTransportById,
  createRoute,
  findRoutes
);

router.post("/options", asyncHandler(transportController.createOption.bind(transportController)));
router.get("/options", asyncHandler(transportController.findOptions.bind(transportController)));
router.get("/options/:id", asyncHandler(transportController.findOptionById.bind(transportController)));
router.post("/routes", asyncHandler(transportController.createRoute.bind(transportController)));
router.get("/routes", asyncHandler(transportController.findRoutes.bind(transportController)));

export default router;