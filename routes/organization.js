import express from "express";

import * as orgController from "../controllers/orgControllers.js";

const router = express.Router();

router.route("/").get(orgController.getAll).post(orgController.createOne);
router
  .route("/:orgId")
  .get(orgController.getOne)
  .put(orgController.updateOne)
  .delete(orgController.deleteOne);

export default router;
