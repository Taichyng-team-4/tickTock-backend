import express from "express";
import { check } from "express-validator";
import ActivityNotice from "../models/activityNotice.js";
import * as factory from "../controllers/factory.js";
import * as authControllers from "../controllers/authControllers.js";
import * as shareControllers from "../controllers/shareControllers.js";
import * as activityNoticeControllers from "../controllers/activityNoticeControllers.js";

const router = express.Router();
router.use(authControllers.authToken);

router
  .route("/")
  .get(factory.getAll(ActivityNotice))
  .post(
    [
      check("activityId").notEmpty(),
      check("title").notEmpty(),
      check("content").notEmpty(),
      check("publishAt").notEmpty(),
      check("expiredAt").notEmpty(),
    ],
    shareControllers.validation,
    activityNoticeControllers.createOne
  );

router
  .get("/:id", factory.getOne(ActivityNotice))
  .patch("/:id", activityNoticeControllers.updateOne)
  .delete("/:id", activityNoticeControllers.deleteOne);

export default router;
