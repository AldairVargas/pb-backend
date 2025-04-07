import express from "express";
import { getRents, getRentById, createRent, updateRentStatus } from "../controllers/rent.controller.js";
import { rentValidator, rentStatusValidator } from "../middleware/validators/rent.validator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/rents", getRents);
router.get("/rents/:id", getRentById);
router.post("/rents", rentValidator, validate, createRent);
router.put("/rents/:id/status", rentStatusValidator, validate, updateRentStatus);

export default router;