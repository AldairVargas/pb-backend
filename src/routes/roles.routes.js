import express from "express";
import { getRoles, getRoleById, createRole, updateRole } from "../controllers/role.controller.js";
import { roleValidator } from "../middleware/validators/role.validator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/roles", getRoles);
router.get("/roles/:id", getRoleById);
router.post("/roles", roleValidator, validate, createRole);
router.put("/roles/:id", roleValidator, validate, updateRole);

export default router;