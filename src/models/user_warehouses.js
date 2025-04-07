import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./users.js";
import Warehouse from "./warehouses.js";

const UserWarehouse = sequelize.define("UserWarehouse", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    comment: 'User managing the warehouse',
    references: {
      model: User,
      key: 'user_id'
    }
  },
  warehouse_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    comment: 'Warehouse managed by the user',
    references: {
      model: Warehouse,
      key: 'warehouse_id'
    }
  },
  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'Creation date'
  }
}, {
  tableName: 'User_Warehouses',
  freezeTableName: true,
  timestamps: false
});

User.belongsToMany(Warehouse, { through: UserWarehouse });
Warehouse.belongsToMany(User, { through: UserWarehouse });

export default UserWarehouse;