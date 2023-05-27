import express from "express";
import Ticket from "../models/ticket.js";
import { check } from "express-validator";
import * as factory from "../controllers/factory.js";

import * as ticketController from "../controllers/ticketControllers.js";
import * as shareControllers from "../controllers/shareControllers.js";
import * as authControllers from "../controllers/authControllers.js";

const router = express.Router();

router.use(authControllers.authToken);

router
  .route("/")
  .get(factory.getAll(Ticket))
  .post(
    [
      check("activityId").notEmpty(),
      check("ticketTypeId").notEmpty(),
    ],
    shareControllers.validation,
    ticketController.createOne
  );

router
  .route("/:id")
  .get(ticketController.checkOwner, factory.getOne(Ticket))
  .patch(factory.updateOne(Ticket))
  .delete(ticketController.checkOwner, factory.deleteOne(Ticket));

export default router;
