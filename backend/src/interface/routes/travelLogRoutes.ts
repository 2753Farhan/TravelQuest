import { Router } from "express";
import { TravelLogController } from "../controllers/travelLogController";
import { KnexTravelLogRepository } from "../../infrastructure/repositories/knexTravelLogRepository";
import { CreateTravelLog } from "../../use-cases/travel_logs/CreateTravelLog";
import { GetTravelLog } from "../../use-cases/travel_logs/GetTravelLog";
import { GetTravelLogsByUser } from "../../use-cases/travel_logs/GetTravelLogsByUser";
import { UpdateTravelLog } from "../../use-cases/travel_logs/UpdateTravelLog";
import { DeleteTravelLog } from "../../use-cases/travel_logs/DeleteTravelLog";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();
const travelLogRepository = new KnexTravelLogRepository();
const createTravelLog = new CreateTravelLog(travelLogRepository);
const getTravelLog = new GetTravelLog(travelLogRepository);
const getTravelLogsByUser = new GetTravelLogsByUser(travelLogRepository);
const updateTravelLog = new UpdateTravelLog(travelLogRepository);
const deleteTravelLog = new DeleteTravelLog(travelLogRepository);
const controller = new TravelLogController(createTravelLog, getTravelLog, getTravelLogsByUser, updateTravelLog, deleteTravelLog);

router.post("/", asyncHandler(controller.create.bind(controller)));
router.get("/:id", asyncHandler(controller.getById.bind(controller)));
router.get("/user/:userId", asyncHandler(controller.getByUser.bind(controller)));
router.patch("/:id", asyncHandler(controller.update.bind(controller)));
router.delete("/:id", asyncHandler(controller.delete.bind(controller)));


export default router;