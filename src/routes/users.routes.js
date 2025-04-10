import express from "express";
import { getUsers, getUserById, createUser, updateUser } from "../controllers/user.controller.js";
import { userValidator, userUpdateValidator } from "../middleware/validators/user.validator.js";
import { validate } from "../middleware/validate.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/roleAuth.middleware.js";

const router = express.Router();

router.get("/users", verifyToken, checkRole("Admin", "SuperAdmin"), getUsers);
router.get("/users/:id", verifyToken, checkRole("Admin", "SuperAdmin"), getUserById);
router.post("/users", verifyToken, checkRole("SuperAdmin"), userValidator, validate, createUser);
router.put("/users/:id", verifyToken, checkRole("SuperAdmin"), userUpdateValidator, validate, updateUser);

export default router;