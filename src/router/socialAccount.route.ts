import Router from "express";
import auth from "../middleware/auth.middleware.js";
import {
  connectSocialAccount,
  getSocialAccountById,
  getSocialAccountsByProjectId,
  removeSocialAccount,
} from "../controllers/socialAccount.controller.js";

const router = Router();

router.route("/connect/:projectId/:platform").post(auth, connectSocialAccount);
router
  .route("/:projectId/:socialAccountId")
  .delete(auth, removeSocialAccount)
  .get(auth, getSocialAccountById);

router.route("/:projectId").get(auth, getSocialAccountsByProjectId);

export default router;
