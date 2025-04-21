import express from "express";
import { createPayment, getCustomerSubscriptions, getAllSubscriptions } from "../controllers/payment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/roleAuth.middleware.js";

const router = express.Router();

router.post("/payments", verifyToken, createPayment);
router.get("/payments/subscriptions/:user_id", verifyToken, getCustomerSubscriptions);
router.get("/payments/subscriptions", verifyToken, checkRole("Admin", "SuperAdmin"), getAllSubscriptions);
// router.post("/webhook", express.raw({type: 'application/json'}), handleWebhook);

export default router;