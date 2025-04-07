import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Role = sequelize.define("Role", {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Role identifier'
  },
  role_name: {
    type: DataTypes.STRING(55),
    allowNull: false,
    comment: 'Role name'
  }
}, {
  tableName: 'Roles',
  freezeTableName: true,
  timestamps: false
});

export default Role;
