import express from "express";
import { register, login, sendRecoveryEmail, verifyRecoveryCode, resetPassword } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../middleware/validators/auth.validator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/auth/register", registerValidator, validate, register);
router.post("/auth/login", loginValidator, validate, login);
router.post("/auth/send-code", sendRecoveryEmail);
router.post("/auth/verify-code", verifyRecoveryCode);
router.post("/auth/reset-password", resetPassword);



export default router;