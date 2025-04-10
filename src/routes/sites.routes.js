import express from "express";
import { getSites, getSiteById, createSite, updateSite } from "../controllers/site.controller.js";
import { siteValidator } from "../middleware/validators/site.validator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/sites", getSites);
router.get("/sites/:id", getSiteById);
router.post("/sites", siteValidator, validate, createSite);
router.put("/sites/:id", siteValidator, validate, updateSite);

export default router;