import { User, Role } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, role_id } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone,
      role_id,
      registration_date: new Date()
    });

    // Remove password from response
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
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token with role information
    const token = jwt.sign(
      { 
        id: user.user_id, 
        email: user.email,
        role: user.Role.role_name // This will be "Admin", "User", or "SuperAdmin"
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
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