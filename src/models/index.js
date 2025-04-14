import Configuration from './configurations.js';
import Role from './roles.js';
import Site from './sites.js';
import Warehouse from './warehouses.js';
import User from './users.js';
import Notification from './notifications.js';
import Rent from './rents.js';
import Payment from './payments.js';
import UserWarehouse from './user_warehouses.js';
import PasswordResetCode from './PasswordResetCode.js';

// Define relationships
User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

Warehouse.belongsTo(Site, { foreignKey: 'site_id' });
Site.hasMany(Warehouse, { foreignKey: 'site_id' });

Notification.belongsTo(User, { foreignKey: 'user_id' });
Notification.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });
User.hasMany(Notification, { foreignKey: 'user_id' });
Warehouse.hasMany(Notification, { foreignKey: 'warehouse_id' });

Rent.belongsTo(User, { foreignKey: 'user_id' });
Rent.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });
User.hasMany(Rent, { foreignKey: 'user_id' });
Warehouse.hasMany(Rent, { foreignKey: 'warehouse_id' });

Payment.belongsTo(Rent, { foreignKey: 'rent_id' });
Rent.hasMany(Payment, { foreignKey: 'rent_id' });

User.belongsToMany(Warehouse, { through: UserWarehouse });
Warehouse.belongsToMany(User, { through: UserWarehouse });

export {
  Configuration,
  Role,
  Site,
  Warehouse,
  User,
  Notification,
  Rent,
  Payment,
  UserWarehouse,
  PasswordResetCode
};