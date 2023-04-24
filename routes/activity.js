import express from "express";

import * as activityControllers from "../controllers/activityControllers.js";
import ticketTypeRouters from "./ticketType.js";

const router = express.Router();

router.use("/:activityId/ticket_types", ticketTypeRouters);

router
  .route("/")
  .get(activityControllers.getAll)
  .post(activityControllers.createOne);

router
  .route("/:activityId")
  .get(activityControllers.getOne)
  .put(activityControllers.updateOne)
  .delete(activityControllers.deleteOne);

router.get("/:activityId/statistics", activityControllers.getStatistics);
export default router;
