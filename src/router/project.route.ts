import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import {
  createProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/project.controller.js";

const router = Router();

router.route("/create").post(auth, createProject);
router.route("/projects").get(auth, getProjects);
router.route("/project/:id").get(auth, getProjectById).put(auth, updateProject);

export default router;
