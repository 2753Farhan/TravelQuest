import express from "express";
import userRoutes from './interface/routes/userRoutes';
import authRoutes from './interface/routes/authRoutes';
import postRoutes from './interface/routes/postRoutes';
import placeRoutes from './interface/routes/placeRoutes';
import transportRoutes from './interface/routes/transportRoutes';
import travelLogRoutes from './interface/routes/traveLogRoutes';
import logEntriesRoutes from './interface/routes/logEntriesRoutes';
import wishlistRoutes from './interface/routes/wishlistRoutes';
import travelGroupRoutes from './interface/routes/travelGroupRoutes';
import chatRoutes from './interface/routes/chatRoutes';
import notificationRoutes from './interface/routes/notificationRoutes';
import { errorHandler } from "./interface/middlewares/errorHandler.middleware";
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/travel-logs", travelLogRoutes);
app.use("/places", placeRoutes);
app.use("/transports", transportRoutes);
app.use("/log-entries", logEntriesRoutes);
app.use("/wishlists", wishlistRoutes);
app.use("/travel-groups", travelGroupRoutes);
app.use("/chats", chatRoutes);
app.use("/notifications", notificationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});