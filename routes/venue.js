import express from "express";
import * as factory from "../controllers/factory.js";
import Venue from "../models/venue.js";

const router = express.Router();

router
  .route("/")
  .get(factory.getAll(Venue))
  .post(factory.createOne(Venue));

router
  .route("/:id")
  .get(factory.getOne(Venue))
  .put(factory.updateOne(Venue))
  .delete(factory.deleteOne(Venue));

export default router;
