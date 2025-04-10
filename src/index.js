import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import siteRoutes from "./routes/sites.routes.js";
import rentRoutes from "./routes/rents.routes.js";
import warehouseRoutes from "./routes/warehouses.routes.js";
import roleRoutes from "./routes/roles.routes.js";
import authRoutes from "./routes/auth.routes.js";
import sequelize from "./config/database.js";
import logger from './utils/logger.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use(userRoutes);
app.use(siteRoutes);
app.use(rentRoutes);
app.use(warehouseRoutes);
app.use(roleRoutes);
app.use(authRoutes);

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info("Conexión a la base de datos establecida correctamente.");

    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Error al conectar a la base de datos:", error);
  }
}

startServer();
