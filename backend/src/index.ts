import express from "express";
import userRoutes from './interface/routes/userRoutes'
import { errorHandler } from "./interface/middlewares/errorHandler.middleware";
const app = express();

app.use(express.json());
app.use("/users", userRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});