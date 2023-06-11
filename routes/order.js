import express from "express";
import { body } from "express-validator";

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
  .get(orderControllers.getAll)
  .post(
    [
      body("tickets").notEmpty(),
      body("tickets.*.ticketTypeId").notEmpty(),
      body("tickets.*.quantity").notEmpty(),
    ],
    shareControllers.validation,
    orderControllers.createOrder
  );

router.route("/me").get(orderControllers.getMe, orderControllers.getAll);

export default router;
