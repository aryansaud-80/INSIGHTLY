import express, {} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./router/auth.route.js";
import userRouter from "./router/user.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
dotenv.config({ path: "./env" });
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map