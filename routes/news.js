import express from "express";

import * as newsControllers from "../controllers/newControllers.js";

const router = express.Router();

router
  .route("/")
  .get(newsControllers.getAll)
  .post(newsControllers.createOne);
router
  .route("/:newsId")
  .get(newsControllers.getOne)
  .patch(newsControllers.updateOne)
  .delete(newsControllers.deleteOne);

export default router;
