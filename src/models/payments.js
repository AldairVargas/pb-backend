import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Rent from "./rents.js";

const Payment = sequelize.define("Payment", {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Payment identifier'
  },
  amount: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    comment: 'Payment amount'
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Payment date'
  },
  payment_method: {
    type: DataTypes.STRING(250),
    allowNull: false,
    comment: 'Payment method'
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Payment status (pending, paid, expired)'
  },
  rent_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Related rent',
    references: {
      model: Rent,
      key: 'rent_id'
    }
  }
}, {
  tableName: 'Payments',
  freezeTableName: true,
  timestamps: false
});

Payment.belongsTo(Rent, { foreignKey: 'rent_id' });

export default Payment;