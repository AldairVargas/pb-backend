import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./users.js";
import Warehouse from "./warehouses.js";

const Rent = sequelize.define("Rent", {
  rent_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Rent identifier'
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Rent start date'
  },
  expiration_date: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Rent expiration date'
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'active',
    comment: 'Rent status (active, expired, finished)'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'User renting the warehouse',
    references: {
      model: User,
      key: 'user_id'
    }
  },
  warehouse_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Warehouse being rented',
    references: {
      model: Warehouse,
      key: 'warehouse_id'
    }
  }
}, {
  tableName: 'Rents',
  freezeTableName: true,
  timestamps: false
});

Rent.belongsTo(User, { foreignKey: 'user_id' });
Rent.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });

export default Rent;