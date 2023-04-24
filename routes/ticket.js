import express from "express";

import * as ticketControllers from "../controllers/ticketControllers.js";

const router = express.Router();

router
  .route("/")
  .get(ticketControllers.getAll)
  .post(ticketControllers.createOne);
router
  .route("/:ticketId")
  .get(ticketControllers.getOne)
  .patch(ticketControllers.updateOne)
  .delete(ticketControllers.deleteOne);

export default router;
