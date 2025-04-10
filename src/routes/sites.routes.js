import express from "express";
import { getSites, getSiteById, createSite, updateSite } from "../controllers/site.controller.js";
import { siteValidator } from "../middleware/validators/site.validator.js";
import { validate } from "../middleware/validate.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/sites", verifyToken, getSites);
router.get("/sites/:id", verifyToken, getSiteById);
router.post("/sites", verifyToken, siteValidator, validate, createSite);
router.put("/sites/:id", verifyToken, siteValidator, validate, updateSite);

export default router;