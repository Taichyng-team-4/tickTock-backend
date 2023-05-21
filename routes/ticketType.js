import express from "express";
import { check } from "express-validator";
import TicketType from "../models/ticketType.js";
import * as factory from "../controllers/factory.js";
import * as ticketTypeController from "../controllers/ticketTypeControllers.js";
import * as authControllers from "../controllers/authControllers.js";

const router = express.Router();

router
  .route("/")
  .get(
    authControllers.authToken,
    factory.getAll(TicketType)
    )
  .post(
    authControllers.authToken,
    ticketTypeController.createOne)
router
  .route("/:id")
  .get(
    authControllers.authToken,
    ticketTypeController.checkOwner,
    factory.getOne(TicketType)
    )
  .put(
    authControllers.authToken,
    ticketTypeController.checkOwner,
    ticketTypeController.updateOne)
  .delete(
    authControllers.authToken,
    ticketTypeController.checkOwner,
    ticketTypeController.deleteOne
   );

export default router;
