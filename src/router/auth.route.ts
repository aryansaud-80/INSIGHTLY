import { Router } from "express";
import {
  loginUser,
  logout,
  RefreshToken,
  register,
} from "../controllers/auth.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(loginUser);
router.route("/refresh-token").get(RefreshToken);
router.route("/logout").post(auth, logout);

export default router;
