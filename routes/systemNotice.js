import express from "express";
import SystemNotice from "../models/systemNotice.js"
import * as factory from "../controllers/factory.js";
import * as authControllers from "../controllers/authControllers.js";
import * as systemNoticeControllers from "../controllers/systemNoticeControllers.js";


const router = express.Router();
router.use(authControllers.authToken);

router.route("/")
      .get(factory.getAll(SystemNotice))
      .post(factory.createOne(SystemNotice));
router
      .get("/:id", factory.getOne(SystemNotice))
      .patch("/:id", factory.updateOne(SystemNotice))
      .delete("/:id", factory.deleteOne(SystemNotice));


export default router;