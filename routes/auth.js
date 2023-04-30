import express from "express";
import { check } from "express-validator";
import * as authControllers from "../controllers/authControllers.js";
import * as shareController from "../controllers/shareControllers.js";

const router = express.Router();
router.post(
  "/signup",
  [
    check("firstName").notEmpty(),
    check("lastName").notEmpty(),
    check("gender").notEmpty(),
    check("birth").isDate(),
    check("country").notEmpty(),
    check("phone").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("passwordConfirm").isLength({ min: 6 }),
  ],
  shareController.validation,
  authControllers.signup
);
router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  shareController.validation,
  authControllers.login
);
router.get("/verify_email", authControllers.verify_email);
router.post(
  "/password/forgot",
  [check("email").normalizeEmail().isEmail()],
  shareController.validation,
  authControllers.forgotPassword
);
router.patch(
  "/password/update",
  [
    check("oldPassword").isLength({ min: 6 }),
    check("password").isLength({ min: 6 }),
    check("passwordConfirm").isLength({ min: 6 }),
  ],
  shareController.validation,
  authControllers.authToken,
  authControllers.updatePassword
);

router.get("/", authControllers.getAll);
router.use(authControllers.authToken);
router.get("/:id", authControllers.getOne);

router.delete("/:id", authControllers.deleteOne);

export default router;
