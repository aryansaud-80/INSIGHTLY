import { Router } from "express";
import { getMe, loginUser, register } from "../controllers/auth.controller.js";
import auth from "../middleware/auth.middleware.js";
const router = Router();
router.route("/register").post(register);
router.route("/login").post(loginUser);
router.route("/me").get(auth, getMe);
export default router;
//# sourceMappingURL=auth.route.js.map