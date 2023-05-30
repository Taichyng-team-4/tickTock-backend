import express from "express";
import ticketList from "../models/ticketList.js";
import * as factory from "../controllers/factory.js";
import * as ticketTypeController from "../controllers/ticketTypeControllers.js";
import * as authControllers from "../controllers/authControllers.js";
import * as ticketListControllers from "../controllers/ticketListControllers.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(factory.getAll(ticketList))



router
  .route("/:id")
  .get(factory.getOne(ticketList))

export default router;
