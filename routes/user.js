import express from "express";
import * as authController from "../controllers/authControllers.js";
import * as userController from "../controllers/userControllers.js";

const router = express.Router();

router.get("/", userController.getAll);
router.use(authController.authToken);
router.get("/:id", userController.getOne);

router.delete("/:id", userController.deleteOne);

export default router;
