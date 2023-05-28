import express from "express";
import Org from "../models/org.js";
import { check } from "express-validator";
import * as factory from "../controllers/factory.js";
import * as authControllers from "../controllers/authControllers.js";
import * as shareControllers from "../controllers/shareControllers.js";
import * as orgControllers from "../controllers/orgControllers.js";

const router = express.Router();

router
  .route("/")
  .get(factory.getAll(Org))
  .post(
    [check("name").notEmpty(), check("email").normalizeEmail().isEmail()],
    shareControllers.validation,
    authControllers.authToken,
    orgControllers.createOne
  );

router
  .route("/me")
  .get(authControllers.authToken, orgControllers.getMe, factory.getAll(Org))

router
  .route("/:id")
  .get(factory.getOne(Org))
  .patch(
    authControllers.authToken,
    orgControllers.checkOwner,
    factory.updateOne(Org)
  )
  .delete(
    authControllers.authToken,
    orgControllers.checkOwner,
    factory.deleteOne(Org)
  );

export default router;
