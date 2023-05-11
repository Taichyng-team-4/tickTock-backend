import express from "express";
import Org from "../models/org.js";
import * as factory from "../controllers/factory.js";

const router = express.Router();

router.route("/").get(factory.getAll(Org)).post(factory.createOne(Org));
router
  .route("/:id")
  .get(factory.getOne(Org))
  .patch(factory.updateOne(Org))
  .delete(factory.deleteOne(Org));

export default router;
