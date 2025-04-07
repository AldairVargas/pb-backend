import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Site from "./sites.js";

const Warehouse = sequelize.define("Warehouse", {
  warehouse_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Warehouse identifier'
  },
  code: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
    comment: 'System internal identifier'
  },
  dimensions: {
    type: DataTypes.STRING(250),
    allowNull: false,
    comment: 'Warehouse dimensions'
  },
  monthly_price: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    comment: 'Monthly rental price'
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'available',
    comment: 'Warehouse status (available, occupied, expired, evicted)'
  },
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Site where the warehouse is located',
    references: {
      model: Site,
      key: 'site_id'
    }
  },
  photo1: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'Photo 1 of the warehouse'
  },
  photo2: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'Photo 2 of the warehouse'
  },
  photo3: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'Photo 3 of the warehouse'
  },
  photo4: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'Photo 4 of the warehouse'
  },
  photo5: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'Photo 5 of the warehouse'
  }
}, {
  tableName: 'Warehouses',
  freezeTableName: true,
  timestamps: false
});

Warehouse.belongsTo(Site, { foreignKey: 'site_id' });

export default Warehouse;