import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Configuration = sequelize.define("Configuration", {
  configuration_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Configuration identifier'
  },
  configuration_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Name of the configuration'
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Configuration value'
  }
}, {
  tableName: 'Configurations',
  freezeTableName: true,
  timestamps: false
});

export default Configuration;