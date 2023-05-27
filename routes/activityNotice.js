import express from "express";
import ActivityNotice from "../models/activityNotice.js";
import * as factory from "../controllers/factory.js";
import * as authControllers from "../controllers/authControllers.js";
import * as activityNoticeControllers from "../controllers/activityNoticeControllers.js";


const router = express.Router();
router.use(authControllers.authToken);

router.route("/")
      .get(factory.getAll(ActivityNotice))
      .post(activityNoticeControllers.createOne);
      
router
      .get("/:id", factory.getOne(ActivityNotice))
      .patch("/:id", activityNoticeControllers.updateOne)
      .delete("/:id", activityNoticeControllers.deleteOne);


export default router;