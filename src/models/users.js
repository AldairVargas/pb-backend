import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Role from "./roles.js";

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'User identifier'
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'User first name'
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'User last name'
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true,
    comment: 'User email'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'User password'
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false,
    comment: 'User phone number'
  },
  registration_date: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'User registration date'
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'User role',
    references: {
      model: Role,
      key: 'role_id'
    }
  }
}, {
  tableName: 'Users',
  freezeTableName: true,
  timestamps: false
});

User.belongsTo(Role, { foreignKey: 'role_id' });

export default User;