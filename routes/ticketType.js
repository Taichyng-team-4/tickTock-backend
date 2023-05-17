import express from "express";
import TicketType from "../models/ticketType.js";
import * as factory from "../controllers/factory.js";
import * as ticketTypeController from "../controllers/ticketTypeControllers.js";

const router = express.Router();

router
  .route("/")
  .get(factory.getAll(TicketType))
  .post(factory.createOne(TicketType))
router
  .route("/:id")
  .get(factory.getOne(TicketType))
  .put(factory.updateOne(TicketType))
  .delete(factory.deleteOne(TicketType));

export default router;
