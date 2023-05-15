import express from "express";

import * as ticketController from "../controllers/ticketControllers.js";

const router = express.Router();

router
  .route("/")
  .get(ticketController.getAll)
  .post(ticketController.createOne);
router
  .route("/:ticketId")
  .get(ticketController.getOne)
  .patch(ticketController.updateOne)
  .delete(ticketController.deleteOne);

export default router;
