import express from "express";

import * as userController from "../controllers/userControllers.js";

const router = express.Router();

router.post("/signup", userController.signup);
router.get("/verify_email", userController.verify_email);
router.post("/login", userController.login);
router.patch("/profile", userController.profile);
router.post("/password/forgot", userController.forgotPassword);
router.patch("/password/update", userController.updatePassword);

export default router;
