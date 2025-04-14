import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mariadb",
    logging: true,
  }
);


export const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Modelos actualizados correctamente (sin pérdida de datos)");
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error);
  }
};

export default sequelize;
