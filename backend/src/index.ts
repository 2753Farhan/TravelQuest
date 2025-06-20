import express from "express";
import userRoutes from './interface/routes/userRoutes';
import postRoutes from './interface/routes/postRoutes'; // New import for post routes
import { errorHandler } from "./interface/middlewares/errorHandler.middleware";

const app = express();

app.use(express.json());
app.use("/users", userRoutes);
app.use("/travel-logs", postRoutes); // New route


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});