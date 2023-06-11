import express from "express";
import { check } from "express-validator";

import Activity from "../models/activity.js";
import * as factory from "../controllers/factory.js";
import orderRouter from "./order.js";
import ticketListRouter from "../routes/ticketList.js";
import ticketTypeRouter from "../routes/ticketType.js";
import * as authControllers from "../controllers/authControllers.js";
import * as shareControllers from "../controllers/shareControllers.js";
import * as orderControllers from "../controllers/orderControllers.js";
import * as activityControllers from "../controllers/activityControllers.js";
import * as ticketTypeControllers from "../controllers/ticketTypeControllers.js";

const router = express.Router();

router.use(
  "/:activityId/ticketTypes",
  activityControllers.setActivityId,
  ticketTypeRouter
);

router.use(
  "/:activityId/ticketLists",
  activityControllers.setActivityId,
  ticketListRouter
);

router.use("/:activityId/orders", orderControllers.setActivityId, orderRouter);

router
  .route("/")
  .get(activityControllers.getAll)
  .post(
    [
      check("orgId").notEmpty(),
      check("category").notEmpty(),
      check("name").notEmpty(),
      check("startAt").notEmpty(),
      check("endAt").notEmpty(),
    ],
    shareControllers.validation,
    authControllers.authToken,
    activityControllers.createOne
  );

router
  .route("/:id")
  .get(factory.getOne(Activity))
  .patch(
    authControllers.authToken,
    activityControllers.setActivityId,
    activityControllers.checkOwner,
    ticketTypeControllers.createUpdateTicketTypeInfo,
    activityControllers.updateOne
  )
  .delete(
    authControllers.authToken,
    activityControllers.setActivityId,
    activityControllers.checkOwner,
    activityControllers.deleteOne
  );

export default router;
