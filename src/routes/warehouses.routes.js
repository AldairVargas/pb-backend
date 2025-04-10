import express from "express";
import { getWarehouses, getWarehouseById, createWarehouse, updateWarehouse, updateWarehouseStatus } from "../controllers/warehouse.controller.js";
import { warehouseValidator, warehouseStatusValidator } from "../middleware/validators/warehouse.validator.js";
import { validate } from "../middleware/validate.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/warehouses", getWarehouses);
router.get("/warehouses/:id", getWarehouseById);
router.post("/warehouses", verifyToken, warehouseValidator, validate, createWarehouse);
router.put("/warehouses/:id", verifyToken, warehouseValidator, validate, updateWarehouse);
router.put("/warehouses/:id/status", verifyToken, warehouseStatusValidator, validate, updateWarehouseStatus);

export default router;