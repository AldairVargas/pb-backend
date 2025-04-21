import express from "express";
import { createPayment, getCustomerSubscriptions } from "../controllers/payment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/payments", verifyToken, createPayment);
router.get("/payments/subscriptions/:user_id", verifyToken, getCustomerSubscriptions);
// router.post("/webhook", express.raw({type: 'application/json'}), handleWebhook);

export default router;