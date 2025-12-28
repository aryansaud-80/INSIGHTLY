import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
const router = Router();
router.route("/register").post(register);
export default router;
//# sourceMappingURL=auth.route.js.map