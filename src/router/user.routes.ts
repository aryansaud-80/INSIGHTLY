import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { getMe } from "../controllers/user.controller.js";

const router = Router();

router.route("/me").get(auth, getMe);

export default router;
