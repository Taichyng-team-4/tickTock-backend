import express from "express";

import * as activityController from "../controllers/activityControllers.js";
import ticketTypeRouter from "./ticketType.js";

const router = express.Router();

router.use("/:activityId/ticket_types", ticketTypeRouter);

router
  .route("/")
  .get(activityController.getAll)
  .post(activityController.createOne);

router
  .route("/:activityId")
  .get(activityController.getOne)
  .put(activityController.updateOne)
  .delete(activityController.deleteOne);

router.get("/:activityId/statistics", activityController.getStatistics);
export default router;
