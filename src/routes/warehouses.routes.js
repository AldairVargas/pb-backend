import express from "express";
import { getWarehouses, getWarehouseById, createWarehouse, updateWarehouse, updateWarehouseStatus, deleteWarehouse } from "../controllers/warehouse.controller.js";
import { warehouseValidator, warehouseStatusValidator } from "../middleware/validators/warehouse.validator.js";
import { validate } from "../middleware/validate.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/roleAuth.middleware.js";

const router = express.Router();

// Public routes
router.get("/warehouses", getWarehouses);
router.get("/warehouses/:id", getWarehouseById);

// Admin and SuperAdmin only routes
router.post("/warehouses", 
  verifyToken, 
  checkRole("Admin", "SuperAdmin"),
  warehouseValidator, 
  validate, 
  createWarehouse
);

router.put("/warehouses/:id", 
  verifyToken, 
  checkRole("Admin", "SuperAdmin"),
  warehouseValidator, 
  validate, 
  updateWarehouse
);

router.put("/warehouses/:id/status", 
  verifyToken, 
  checkRole("Admin", "SuperAdmin"),
  warehouseStatusValidator, 
  validate, 
  updateWarehouseStatus
);

router.delete("/warehouses/:id", 
  verifyToken, 
  checkRole("Admin", "SuperAdmin"),
  validate, 
  deleteWarehouse
);

export default router;