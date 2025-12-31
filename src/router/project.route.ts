import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { createProject } from "../controllers/project.controller.js";

const router = Router();

router.route("/create").post(auth, createProject);

export default router;
