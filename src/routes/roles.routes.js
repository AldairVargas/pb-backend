import express from "express";
import { getRoles, getRoleById, createRole, updateRole } from "../controllers/role.controller.js";
import { roleValidator } from "../middleware/validators/role.validator.js";
import { validate } from "../middleware/validate.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/roles", verifyToken, getRoles);
router.get("/roles/:id", verifyToken, getRoleById);
router.post("/roles", verifyToken, roleValidator, validate, createRole);
router.put("/roles/:id", verifyToken, roleValidator, validate, updateRole);

export default router;