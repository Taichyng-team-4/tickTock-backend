import express from "express";
import Ticket from "../models/ticket.js";
import { body } from "express-validator";
import * as factory from "../controllers/factory.js";

import * as authControllers from "../controllers/authControllers.js";
import * as shareControllers from "../controllers/shareControllers.js";
import * as ticketControllers from "../controllers/ticketControllers.js";

const router = express.Router();

router.use(authControllers.authToken);

router
  .route("/")
  .get(factory.getAll(Ticket))
  .post(
    [
      body("tickets").notEmpty(),
      body("tickets.*.ticketTypeId").notEmpty(),
      body("tickets.*.quantity").notEmpty(),
    ],
    shareControllers.validation,
    ticketControllers.createMany
  )
  .delete(
    [body("ticketIds").notEmpty()],
    ticketControllers.checkOwners,
    ticketControllers.deleteMany
  );

router.route("/me").get(ticketControllers.getMe, factory.getAll(Ticket));

router
  .route("/:id")
  .get(ticketControllers.checkOwner, factory.getOne(Ticket))
  .patch(factory.updateOne(Ticket))
  .delete(ticketControllers.checkOwner, ticketControllers.deleteOne);

export default router;
