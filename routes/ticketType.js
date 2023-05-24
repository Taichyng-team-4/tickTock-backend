import express from "express";
import TicketType from "../models/ticketType.js";
import * as factory from "../controllers/factory.js";
import * as ticketTypeController from "../controllers/ticketTypeControllers.js";
import * as authControllers from "../controllers/authControllers.js";

const router = express.Router();

router
  .route("/")
  .get(
    factory.getAll(TicketType)
    )
  .post(
    authControllers.authToken,
    ticketTypeController.checkOwner,
    ticketTypeController.createOne)
router
  .route("/:id")
  .get(
    ticketTypeController.getOne
        )
  .patch(
    authControllers.authToken,
    ticketTypeController.checkOwner,
    ticketTypeController.updateOne)
  .delete(
    authControllers.authToken,
    ticketTypeController.checkOwner,
    ticketTypeController.deleteOne
   );

export default router;
