import express from "express";
import { getWarehouses, getWarehouseById, createWarehouse, updateWarehouse, updateWarehouseStatus } from "../controllers/warehouse.controller.js";
import { warehouseValidator, warehouseStatusValidator } from "../middleware/validators/warehouse.validator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/warehouses", getWarehouses);
router.get("/warehouses/:id", getWarehouseById);
router.post("/warehouses", warehouseValidator, validate, createWarehouse);
router.put("/warehouses/:id", warehouseValidator, validate, updateWarehouse);
router.put("/warehouses/:id/status", warehouseStatusValidator, validate, updateWarehouseStatus);

export default router;