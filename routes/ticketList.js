import express from "express";
import { body } from "express-validator";
import ticketList from "../models/ticketList.js";
import * as factory from "../controllers/factory.js";
import * as authControllers from "../controllers/authControllers.js";
import * as shareControllers from "../controllers/shareControllers.js";
import * as activityControllers from "../controllers/activityControllers.js";
import * as ticketListControllers from "../controllers/ticketListControllers.js";

const router = express.Router({ mergeParams: true });

router.get("/", factory.getAll(ticketList));
router.get("/:id", factory.getOne(ticketList));

router.use(authControllers.authToken, activityControllers.checkOwner);

router
  .route("/")
  .post(
    [body("activityId").notEmpty()],
    shareControllers.validation,
    ticketListControllers.createMany
  )
  .delete(
    [body("activityId").notEmpty()],
    shareControllers.validation,
    ticketListControllers.deleteMany
  )
  .put([body("activityId").notEmpty()], ticketListControllers.updateMany);

router
  .route("/:id")
  .patch(factory.updateOne(ticketList))
  .delete(factory.deleteOne(ticketList));

export default router;
