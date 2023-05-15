import express from "express";
import User from "../models/user.js";
import * as factory from "../controllers/factory.js";
import * as authControllers from "../controllers/authControllers.js";
import * as userControllers from "../controllers/userControllers.js";

const router = express.Router();

router.use(authControllers.authToken);

router
  .route("/")
  .get(userControllers.getMe, userControllers.getProfile, factory.getOne(User))
  .patch(
    userControllers.getMe,
    userControllers.getProfile,
    userControllers.checkUpdatedProfile,
    factory.updateOne(User)
  )
  .delete(userControllers.getMe, factory.deleteOne(User));

export default router;
