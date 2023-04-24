import express from "express";

import * as orderControllers from "../controllers/orderControllers.js";

const router = express.Router();

router.route("/").get(orderControllers.getAll).post(orderControllers.createOne);

router
  .route("/:orderId")
  .get(orderControllers.getOne)
  .patch(orderControllers.updateOne)
  .delete(orderControllers.deleteOne);

router.get("/:orderId/buyersInfo", orderControllers.getBuyersInfo);

export default router;
