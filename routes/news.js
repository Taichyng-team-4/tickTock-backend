import express from "express";

import * as newsController from "../controllers/newsControllers.js";

const router = express.Router();

router
  .route("/")
  .get(newsController.getAll)
  .post(newsController.createOne);
  
router
  .route("/:newsId")
  .get(newsController.getOne)
  .patch(newsController.updateOne)
  .delete(newsController.deleteOne);

export default router;
