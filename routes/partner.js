import express from "express";

import Partner from "../models/partners.js";
import * as upload from "../utils/helper/upload.js";
import * as factory from "../controllers/factory.js";
import * as authControllers from "../controllers/authControllers.js";
import * as partnerControllers from "../controllers/partnerControllers.js";

const router = express.Router();

router
  .route("/")
  .get(factory.getAll(Partner))
  .post(authControllers.authToken, factory.createOne(Partner));

router
  .route("/:id")
  .get(factory.getOne(Partner))
  .patch(
    authControllers.authToken,
    upload.uploadToMemory.single("icon"),
    partnerControllers.updateIcon,
    factory.updateOne(Partner)
  )
  .delete(authControllers.authToken, factory.deleteOne(Partner));

export default router;
