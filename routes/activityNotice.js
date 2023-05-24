import express from "express";
import ActivityNotice from "../models/activityNotice.js";
import * as factory from "../controllers/factory.js";
import * as authControllers from "../controllers/authControllers.js";
import * as activityNoticeControllers from "../controllers/activityNoticeControllers.js";


const router = express.Router();
router.use(authControllers.authToken);

router.route("/")
      .get(factory.getAll(ActivityNotice))
      .post(activityNoticeControllers.createOne(ActivityNotice));
      
router
      .get("/:id", factory.getOne(ActivityNotice))
      .patch("/:newId", activityNoticeControllers.updateOne(ActivityNotice))
      .delete("/:newId", activityNoticeControllers.deleteOne(ActivityNotice));


export default router;