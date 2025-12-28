import express, {} from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./router/auth.route.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
export default app;
//# sourceMappingURL=app.js.map