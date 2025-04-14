import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PasswordResetCode = sequelize.define("PasswordResetCode", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: "PasswordResetCodes",
  timestamps: false,
});

export default PasswordResetCode;

