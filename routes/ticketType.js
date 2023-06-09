import express from "express";
import { body } from "express-validator";

import TicketType from "../models/ticketType.js";
import * as factory from "../controllers/factory.js";
import * as authControllers from "../controllers/authControllers.js";
import * as shareControllers from "../controllers/shareControllers.js";
import * as activityControllers from "../controllers/activityControllers.js";
import * as ticketTypeControllers from "../controllers/ticketTypeControllers.js";

const router = express.Router({ mergeParams: true });

router.get("/", ticketTypeControllers.getAll);

router.get("/:id", factory.getOne(TicketType));

router.use(authControllers.authToken, activityControllers.checkOwner);

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
    ticketTypeControllers.createMany,
  )
  .put(
    ticketTypeControllers.createUpdateTicketTypeInfo,
    [
      body("createTickTypes.*.name").notEmpty(),
      body("createTickTypes.*.zone").notEmpty(),
      body("createTickTypes.*.price").notEmpty(),
      body("createTickTypes.*.saleStartAt").notEmpty(),
      body("createTickTypes.*.saleEndAt").notEmpty(),
    ],
    shareControllers.validation,
    ticketTypeControllers.updateMany
  )
  .delete([body("tickTypeIds").notEmpty()], ticketTypeControllers.deleteMany);

export default router;
