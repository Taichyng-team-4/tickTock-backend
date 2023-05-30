import express from "express";
import TicketType from "../models/ticketType.js";
import * as factory from "../controllers/factory.js";
import * as ticketTypeController from "../controllers/ticketTypeControllers.js";
import * as authControllers from "../controllers/authControllers.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(factory.getAll(TicketType))
  .post(
    authControllers.authToken,
    ticketTypeController.checkOwner,
    ticketTypeController.createMany,
    ticketTypeController.createTicketList,
  )
  .delete(
    authControllers.authToken,
    ticketTypeController.checkOwner,
    ticketTypeController.deleteMany
  );



router
  .route("/:id")
  .get(factory.getOne(TicketType))
  .patch(
    authControllers.authToken,
    ticketTypeController.checkOwner,
    ticketTypeController.updateMany
  );

export default router;
