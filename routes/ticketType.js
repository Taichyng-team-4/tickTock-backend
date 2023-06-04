import express from "express";
import { body } from "express-validator";
import TicketType from "../models/ticketType.js";
import * as factory from "../controllers/factory.js";
import * as authControllers from "../controllers/authControllers.js";
import * as shareControllers from "../controllers/shareControllers.js";
import * as ticketTypeController from "../controllers/ticketTypeControllers.js";
import * as ticketListControllers from "../controllers/ticketListControllers.js";

const router = express.Router({ mergeParams: true });

router.get("/", factory.getAll(TicketType));

router.get("/:id", factory.getOne(TicketType));

router.use(authControllers.authToken, ticketTypeController.checkOwner);

router
  .route("/")
  .post(
    [
      body("tickTypes.*.name").notEmpty(),
      body("tickTypes.*.zone").notEmpty(),
      body("tickTypes.*.price").notEmpty(),
      body("tickTypes.*.saleStartAt").notEmpty(),
      body("tickTypes.*.saleEndAt").notEmpty(),
    ],
    shareControllers.validation,
    ticketTypeController.createMany,
    ticketListControllers.createTicketList
  )
  .put(
    ticketTypeController.checkUpdateOrCreate,
    [
      body("createTickTypes.*.name").notEmpty(),
      body("createTickTypes.*.zone").notEmpty(),
      body("createTickTypes.*.price").notEmpty(),
      body("createTickTypes.*.saleStartAt").notEmpty(),
      body("createTickTypes.*.saleEndAt").notEmpty(),
    ],
    shareControllers.validation,
    ticketTypeController.updateMany
  )
  .delete(ticketTypeController.deleteMany);

export default router;
