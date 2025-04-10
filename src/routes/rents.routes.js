import express from "express";
import { getRents, getRentById, createRent, updateRentStatus } from "../controllers/rent.controller.js";
import { rentValidator, rentStatusValidator } from "../middleware/validators/rent.validator.js";
import { validate } from "../middleware/validate.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/rents", verifyToken, getRents);
router.get("/rents/:id", verifyToken, getRentById);
router.post("/rents", verifyToken, rentValidator, validate, createRent);
router.put("/rents/:id/status", verifyToken, rentStatusValidator, validate, updateRentStatus);

export default router;