import express from "express";
import { check } from "express-validator";
import Activity from "../models/activity.js";
import * as factory from "../controllers/factory.js";
import ticketTypeRouter from "../routes/ticketType.js";
import * as authControllers from "../controllers/authControllers.js";
import * as shareControllers from "../controllers/shareControllers.js";
import * as activityControllers from "../controllers/activityControllers.js";
import * as ticketTypeControllers from "../controllers/ticketTypeControllers.js";

const router = express.Router();

router.use(
  "/:activityId/ticketTypes",
  ticketTypeControllers.setActivity,
  ticketTypeRouter
);

router
  .route("/")
  .get(factory.getAll(Activity))
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
    activityControllers.checkOwner,
    activityControllers.updateOne
  )
  .delete(
    authControllers.authToken,
    activityControllers.checkOwner,
    activityControllers.deleteOne
  );

export default router;
