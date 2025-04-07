import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../middleware/validators/auth.validator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/auth/register", registerValidator, validate, register);
router.post("/auth/login", loginValidator, validate, login);

export default router;