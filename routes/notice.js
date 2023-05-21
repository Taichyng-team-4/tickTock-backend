import express from "express";
import ActivityNotice from "../models/activityNotice.js";
import SystemNotice from "../models/systemNotice.js"
import * as factory from "../controllers/factory.js";
import * as authControllers from "../controllers/authControllers.js";
import * as userControllers from "../controllers/userControllers.js";
import * as newsControllers from "../controllers/newsControllers.js";


const router = express.Router();
router.use(authControllers.authToken);

router.route("/activity/")
      .get(factory.getAll(ActivityNotice))
      .post(factory.createOne(ActivityNotice));
      
router
      .get("/activity/:id", factory.getOne(ActivityNotice))
      .patch("/activity/:newid", newsControllers.updateOne(ActivityNotice))
      .delete("/activity/:newid", newsControllers.deleteOne(ActivityNotice));


router.route("/system/")
      .get(factory.getAll(SystemNotice))
      .post(factory.createOne(SystemNotice));
router
      .get("/system/:id", factory.getOne(SystemNotice))
      .patch("/system/:systemid", newsControllers.updateOne(SystemNotice))
      .delete("/system/:systemid", newsControllers.deleteOne(SystemNotice));


export default router;