import express from "express";
import SystemNotice from "../models/systemNotice.js"
import * as factory from "../controllers/factory.js";
import * as authControllers from "../controllers/authControllers.js";
import * as systemNoticeControllers from "../controllers/systemNoticeControllers.js";


const router = express.Router();
router.use(authControllers.authToken);

router.route("/")
      .get(factory.getAll(SystemNotice))
      .post(systemNoticeControllers.createOne(SystemNotice));
router
      .get("/:id", factory.getOne(SystemNotice))
      .patch("/:newId", systemNoticeControllers.updateOne(SystemNotice))
      .delete("/:newId", systemNoticeControllers.deleteOne(SystemNotice));


export default router;