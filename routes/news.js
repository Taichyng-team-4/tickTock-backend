import express from "express";
import ActivityNotice from "../models/activityNotice.js";
import * as factory from "../controllers/factory.js";

const router = express.Router();

router.route("/")
      .get(factory.getAll(ActivityNotice))
      .post(factory.createOne(ActivityNotice));
router
  .route("/:newsId")
  .get(factory.getOne(ActivityNotice))
  .patch(factory.updateOne(ActivityNotice))
  .delete(factory.deleteOne(ActivityNotice));

export default router;