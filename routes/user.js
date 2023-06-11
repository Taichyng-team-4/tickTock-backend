import express from "express";

import User from "../models/user.js";
import orderRouter from "./order.js";
import activityRouters from "./activity.js";
import * as factory from "../controllers/factory.js";
import * as orderControllers from "../controllers/orderControllers.js";

const router = express.Router();

router.use("/:ownerId/orders", orderControllers.setOwnerId, orderRouter);
router.use("/:ownerId/activities", orderControllers.setOwnerId, activityRouters);

router.route("/").get(factory.getAll(User)).post(factory.createOne(User));
router
  .route("/:id")
  .get(factory.getOne(User))
  .patch(factory.updateOne(User))
  .delete(factory.deleteOne(User));

export default router;
