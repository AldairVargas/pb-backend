import { Usuario, Rol } from "../models/index.js";
import bcrypt from "bcrypt";

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [{ model: Rol }],
      attributes: { exclude: ['contra'] }
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      include: [{ model: Rol }],
      attributes: { exclude: ['contra'] }
    });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario not found" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.contra, 10);
    const usuario = await Usuario.create({
      ...req.body,
      contra: hashedPassword
    });
    const userWithoutPassword = usuario.toJSON();
    delete userWithoutPassword.contra;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario not found" });
    }
    if (req.body.contra) {
      req.body.contra = await bcrypt.hash(req.body.contra, 10);
    }
    await usuario.update(req.body);
    const userWithoutPassword = usuario.toJSON();
    delete userWithoutPassword.contra;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
