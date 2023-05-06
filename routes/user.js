import express from "express";
import User from "../models/user.js";
import * as factory from "../controllers/factory.js";
import * as authControllers from "../controllers/authControllers.js";
import * as userControllers from "../controllers/userControllers.js";

const selectFields =
  "+email +name +gender " +
  "+phone +birth +avatar " +
  "-updatedAt -createdAt";

const router = express.Router();

router.use(authControllers.authToken);

router
  .route("/")
  .get(userControllers.getMe, factory.getOne(User, selectFields))
  .patch(
    userControllers.getMe,
    userControllers.updateOne,
    factory.getOne(User, selectFields)
  );

export default router;
