import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Site = sequelize.define("Site", {
  site_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Site identifier'
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    comment: 'Site name'
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Site location'
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Site status (active/inactive)'
  },
  state: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'State where the site is located'
  },
  municipality: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Municipality where the site is located'
  }
}, {
  tableName: 'Sites',
  freezeTableName: true,
  timestamps: false
});

export default Site;