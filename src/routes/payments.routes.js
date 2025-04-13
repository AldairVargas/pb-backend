import express from "express";
import { createPayment } from "../controllers/payment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/payments", verifyToken, createPayment);
// router.post("/webhook", express.raw({type: 'application/json'}), handleWebhook);

export default router;