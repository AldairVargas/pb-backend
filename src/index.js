import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import siteRoutes from "./routes/sites.routes.js";
import rentRoutes from "./routes/rents.routes.js";
import warehouseRoutes from "./routes/warehouses.routes.js";
import roleRoutes from "./routes/roles.routes.js";
import authRoutes from "./routes/auth.routes.js";
import paymentRoutes from "./routes/payments.routes.js";
import sequelize from "./config/database.js";
import logger from './utils/logger.js';
import dotenv from 'dotenv';
import { handleWebhook } from "./controllers/payment.controller.js";

dotenv.config({ path: `./envs/.env.${process.env.NODE_ENV}` });
logger.info(`Iniciando la aplicación en el entorno: ${process.env.NODE_ENV}`);

const app = express();
app.use(express.json());
app.use(cors());

// Webhook route
// Place this before any other middleware
app.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

// Regular routes
app.use(userRoutes);
app.use(siteRoutes);
app.use(rentRoutes);
app.use(warehouseRoutes);
app.use(roleRoutes);
app.use(authRoutes);
app.use(paymentRoutes);

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    await sequelize.sync({ alter: { drop: false } });
    console.log("Database synchronized successfully.");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database error:", error);
  }
}

startServer();
