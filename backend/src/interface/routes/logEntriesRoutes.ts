import { Router } from "express";
import { LogEntryController } from "../controllers/logEntryController";
import { knexLogEntryRepository } from "../../infrastructure/repositories/knexLogEntryRepository";
import { CreateLogEntry } from "../../use-cases/LogEntries/CreateLogEntry";
import { GetLogEntries } from "../../use-cases/LogEntries/GetLogEntries";
import { GetLogEntry } from "../../use-cases/LogEntries/GetLogEntry";
import { asyncHandler } from "../middlewares/asyncHandler";
import { DeleteLogEntry } from "../../use-cases/LogEntries/DeleteLogEntry";

const router = Router();

const logEntryRepository = new knexLogEntryRepository();
const createLogEntry = new CreateLogEntry(logEntryRepository);
const getLogEntries = new GetLogEntries(logEntryRepository);
const getLogEntry = new GetLogEntry(logEntryRepository);
const deleteLogEntry = new DeleteLogEntry(logEntryRepository);

const logEntryController = new LogEntryController(
  createLogEntry,
  getLogEntries,
  getLogEntry,
  deleteLogEntry
);

router.post("/", asyncHandler(logEntryController.create.bind(logEntryController)));
router.get("/log/:logId", asyncHandler(logEntryController.findByLogId.bind(logEntryController)));
router.get("/:id", asyncHandler(logEntryController.findById.bind(logEntryController)));
router.delete("/:entryId", asyncHandler(logEntryController.delete.bind(logEntryController)));

export default router;