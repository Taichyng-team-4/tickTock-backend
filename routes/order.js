import express from "express";
import { body } from "express-validator";

import Order from "../models/order.js";
import * as factory from "../controllers/factory.js";
import * as authControllers from "../controllers/authControllers.js";
import * as orderControllers from "../controllers/orderControllers.js";
import * as shareControllers from "../controllers/shareControllers.js";

const router = express.Router();

router.get("/confirm", orderControllers.confirmOrder);
router.get("/cancel", (req, res) => {
  res.status(200).json({ order: "cancel" });
});

router.use(authControllers.authToken);

router
  .route("/")
  .get(factory.getAll(Order))
  .post(
    [
      body("tickets").notEmpty(),
      body("tickets.*.ticketTypeId").notEmpty(),
      body("tickets.*.quantity").notEmpty(),
    ],
    shareControllers.validation,
    orderControllers.createOrder
  );

export default router;
