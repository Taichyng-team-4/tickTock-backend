import express from "express";
import { check } from "express-validator";
import * as authController from "../controllers/authControllers.js";
import * as shareController from "../controllers/shareControllers.js";

const router = express.Router();
router.post(
  "/signup",
  [
    check("name").notEmpty(),
    check("gender").notEmpty(),
    check("birth").isDate(),
    check("country").notEmpty(),
    check("phone").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("passwordConfirm").isLength({ min: 6 }),
  ],
  shareController.validation,
  authController.signup
);
router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  shareController.validation,
  authController.login
);
router.get("/verify_email", authController.verify_email);
router.post(
  "/password/forgot",
  [check("email").normalizeEmail().isEmail()],
  shareController.validation,
  authController.forgotPassword
);
router.patch(
  "/password/update",
  [
    check("oldPassword").isLength({ min: 6 }),
    check("password").isLength({ min: 6 }),
    check("passwordConfirm").isLength({ min: 6 }),
  ],
  shareController.validation,
  authController.authToken,
  authController.updatePassword
);

router.get("/", authController.getAll);
router.use(authController.authToken);
router.get("/:id", authController.getOne);

router.delete("/:id", authController.deleteOne);

export default router;
