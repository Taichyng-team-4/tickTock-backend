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
    ticketTypeController.checkOwnerAndJoinActivityId,
    ticketTypeController.createMany
  )
  .delete(
    authControllers.authToken,
    ticketTypeController.checkOwnerAndJoinActivityId,
    ticketTypeController.deleteMany
  )
  .put(
    authControllers.authToken,
    ticketTypeController.checkOwnerAndJoinActivityId,
    ticketTypeController.updateMany
  );
router
  .route("/:id")
  .get(factory.getOne(TicketType));
 

export default router;
