import Router from "express";
import auth from "../middleware/auth.middleware.js";
import { connectSocialAccount } from "../controllers/socialAccount.controller.js";
const router = Router();
router.route("/connect/:projectId/:platform").post(auth, connectSocialAccount);
export default router;
//# sourceMappingURL=socialAccount.route.js.map