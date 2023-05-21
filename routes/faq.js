import express from "express";

import FAQ from "../models/faq.js";
import * as upload from "../utils/helper/upload.js";
import * as factory from "../controllers/factory.js";
import * as authControllers from "../controllers/authControllers.js";
import * as partnerControllers from "../controllers/partnerControllers.js";

const router = express.Router();

router
  .route("/")
  .get(factory.getAll(FAQ))
  .post(authControllers.authToken, factory.createOne(FAQ));

router
  .route("/:id")
  .get(factory.getOne(FAQ))
  .patch(
    authControllers.authToken,
    factory.updateOne(FAQ)
  )
  .delete(authControllers.authToken, factory.deleteOne(FAQ));

export default router;
