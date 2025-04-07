import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./users.js";
import Warehouse from "./warehouses.js";

const Notification = sequelize.define("Notification", {
  notification_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Notification identifier'
  },
  notification_type: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'reminder',
    comment: 'Notification type (reminder, expiration notice, eviction)'
  },
  sent_date: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Notification sent date'
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'sent',
    comment: 'Notification status'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'User receiving the notification',
    references: {
      model: User,
      key: 'user_id'
    }
  },
  warehouse_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Warehouse related to the notification',
    references: {
      model: Warehouse,
      key: 'warehouse_id'
    }
  }
}, {
  tableName: 'Notifications',
  freezeTableName: true,
  timestamps: false
});

Notification.belongsTo(User, { foreignKey: 'user_id' });
Notification.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });

export default Notification;