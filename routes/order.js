import express from "express";

import * as orderController from "../controllers/orderControllers.js";

const router = express.Router();

router.route("/").get(orderController.getAll).post(orderController.createOne);

router
  .route("/:orderId")
  .get(orderController.getOne)
  .patch(orderController.updateOne)
  .delete(orderController.deleteOne);

router.get("/:orderId/buyersInfo", orderController.getBuyersInfo);

export default router;
