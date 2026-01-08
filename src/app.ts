import express, { type Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./router/auth.route.js";
import userRouter from "./router/user.routes.js";
import projectRouter from "./router/project.route.js";
import socialAccountRouter from "./router/socialAccount.route.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config({ path: "./env" });

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000", // your frontend
  credentials: true, // MUST to allow cookies
}));

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/project", projectRouter);
app.use("/social-account", socialAccountRouter);

app.post('/test-cookie', (req, res) => {
  res.cookie("testCookie", "TEST123", { httpOnly: true, secure: false });
  res.status(200).json({ message: "Cookie set!" });
});

app.use(errorHandler);

export default app;
