import express from "express";

import * as ticketTypeController from "../controllers/ticketTypeControllers.js";

const router = express.Router();

router
  .route("/")
  .get(ticketTypeController.getAll)
  .post(ticketTypeController.createOne);
router
  .route("/:ticketTypeId")
  .get(ticketTypeController.getOne)
  .put(ticketTypeController.updateOne)
  .delete(ticketTypeController.deleteOne);

export default router;
