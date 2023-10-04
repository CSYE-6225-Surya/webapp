import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Account.init({
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
  }, {
    sequelize,
    timestamps: true,
    createdAt: 'account_created',
    updatedAt: 'account_updated',
    modelName: 'Account',
  });
  return Account;
}