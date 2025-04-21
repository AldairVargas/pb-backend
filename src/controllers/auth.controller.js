import { User, Role, PasswordResetCode } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // desde .env

export const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, role_id } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Formato de correo inválido" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone,
      role_id,
      registration_date: new Date(),
      active: true
    });

    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role }]
    });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    if (!user.active) {
      return res.status(401).json({
        message: "Esta cuenta ha sido desactivada. Contacta al administrador."
      });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.Role?.role_name
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendRecoveryEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "El correo es requerido" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Formato de correo inválido" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "No existe un usuario con ese correo" });
    }

    await PasswordResetCode.destroy({ where: { email } });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await PasswordResetCode.create({
      email,
      code,
      expires_at: new Date(Date.now() + 15 * 60 * 1000),
    });

    const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: "Código de recuperación de contraseña - BodegaSegura",
      html: `
        <h2>¿Olvidaste tu contraseña?</h2>
        <p>Tu código de recuperación es:</p>
        <h1 style="font-size: 28px; letter-spacing: 5px;">${code}</h1>
        <p><small>Este código expirará en 15 minutos.</small></p>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (sendError) {
      console.error("❌ Error al enviar correo:", sendError?.response?.body || sendError.message || sendError);
      return res.status(500).json({ message: "No se pudo enviar el correo", error: sendError });
    }

    return res.json({ message: "Código enviado al correo correctamente", token });
  } catch (error) {
    console.error("❌ Error general:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const verifyRecoveryCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const record = await PasswordResetCode.findOne({
      where: { email, code },
    });

    if (!record) {
      return res.status(400).json({ message: "Código inválido o no encontrado" });
    }

    if (new Date() > record.expires_at) {
      await record.destroy(); // limpiar código expirado
      return res.status(400).json({ message: "El código ha expirado" });
    }

    await record.destroy(); // eliminar para que no se reutilice

    res.json({ message: "Código verificado correctamente" });
  } catch (error) {
    console.error("Error verificando código:", error);
    res.status(500).json({ message: "Error al verificar el código" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token, code, password } = req.body;

    if (!token || !code || !password) {
      return res.status(400).json({ message: "Token, código y nueva contraseña son requeridos" });
    }

    // Verificar el token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json(error, { message: "Token inválido o expirado" });
    }

    const email = decoded.email;

    // Buscar el código válido
    const codeRecord = await PasswordResetCode.findOne({ where: { email, code } });

    if (!codeRecord) {
      return res.status(400).json({ message: "Código inválido" });
    }

    if (new Date() > codeRecord.expires_at) {
      await codeRecord.destroy(); // eliminarlo si ya expiró
      return res.status(400).json({ message: "El código ha expirado" });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({ password: hashedPassword });

    await codeRecord.destroy();

    return res.json({ message: "Contraseña restablecida correctamente" });
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

