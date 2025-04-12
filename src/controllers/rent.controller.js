import { Rent, User, Warehouse } from "../models/index.js";

export const getRents = async (req, res) => {
  try {
    const rents = await Rent.findAll({
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Warehouse }
      ]
    });
    res.json(rents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRentById = async (req, res) => {
  try {
    const rent = await Rent.findByPk(req.params.id, {
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Warehouse }
      ]
    });
    if (!rent) {
      return res.status(404).json({ message: "Rent not found" });
    }
    res.json(rent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRent = async (req, res) => {
  try {
    const rent = await Rent.create(req.body);
    await Warehouse.update(
      { status: 'occupied' },
      { where: { warehouse_id: req.body.warehouse_id } }
    );
    res.status(201).json(rent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRentStatus = async (req, res) => {
  try {
    const rent = await Rent.findByPk(req.params.id);
    if (!rent) {
      return res.status(404).json({ message: "Rent not found" });
    }
    await rent.update({ status: req.body.status });
    if (req.body.status === 'finished') {
      await Warehouse.update(
        { status: 'available' },
        { where: { warehouse_id: rent.warehouse_id } }
      );
    }
    res.json(rent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRent = async (req, res) => {
  try {
    const rent = await Rent.findByPk(req.params.id);
    if (!rent) {
      return res.status(404).json({ message: "Rent not found" });
    }
    await Warehouse.update(
      { status: 'available' },
      { where: { warehouse_id: rent.warehouse_id } }
    );
    await rent.destroy();
    res.json({ message: "Rent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};