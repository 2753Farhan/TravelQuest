// src/index.ts
import express from "express";
import userRoutes from './interface/routes/userRoutes';
import postRoutes from './interface/routes/postRoutes';
import placeRoutes from './interface/routes/placeRoutes';
import transportRoutes from './interface/routes/transportRoutes';
import travelLogRoutes from './interface/routes/travelLogRoutes';
import logEntriesRoutes from './interface/routes/logEntriesRoutes';

import { errorHandler } from "./interface/middlewares/errorHandler.middleware";

const app = express();

app.use(express.json());
app.use("/users", userRoutes);
app.use("/travel-logs", travelLogRoutes);
app.use("/places", placeRoutes); 
app.use("/transports", transportRoutes)
app.use("/log-entries", logEntriesRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});