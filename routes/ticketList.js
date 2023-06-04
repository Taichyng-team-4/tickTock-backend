import express from "express";
import ticketList from "../models/ticketList.js";
import * as factory from "../controllers/factory.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(factory.getAll(ticketList));

router.route("/:id").get(factory.getOne(ticketList));

export default router;
