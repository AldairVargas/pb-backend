import { Warehouse, Site } from "../models/index.js";

export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.findAll({
      include: [{ model: Site }]
    });
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWarehouseById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id, {
      include: [{ model: Site }]
    });
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    res.json(warehouse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createWarehouse = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const warehouse = await Warehouse.create(req.body);
    res.status(201).json(warehouse);
  } catch (error) {
    console.log('Error details:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message,
          value: e.value
        }))
      });
    }
    res.status(500).json({ 
      message: error.message,
      type: error.name 
    });
  }
};

export const updateWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    await warehouse.update(req.body);
    res.json(warehouse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWarehouseStatus = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    await warehouse.update({ status: req.body.status });
    res.json(warehouse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    await warehouse.destroy();
    res.json({ message: "Warehouse deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};