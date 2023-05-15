import express from "express";
import * as factory from "../controllers/factory.js";
import ActivitySetting from "../models/activitySetting.js";

const router = express.Router();

router
  .route("/")
  .get(factory.getAll(ActivitySetting))
  .post(factory.createOne(ActivitySetting));

router
  .route("/:id")
  .get(factory.getOne(ActivitySetting))
  .put(factory.updateOne(ActivitySetting))
  .delete(factory.deleteOne(ActivitySetting));

export default router;
