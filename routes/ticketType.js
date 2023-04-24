import express from "express";

import * as ticketTypeControllers from "../controllers/ticketTypeControllers.js";

const router = express.Router();

router
  .route("/")
  .get(ticketTypeControllers.getAll)
  .post(ticketTypeControllers.createOne);
router
  .route("/:ticketTypeId")
  .get(ticketTypeControllers.getOne)
  .put(ticketTypeControllers.updateOne)
  .delete(ticketTypeControllers.deleteOne);

export default router;
