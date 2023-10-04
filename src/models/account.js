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
    id: { type: DataTypes.STRING, primaryKey: true },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    createdAt: 'account_created',
    updatedAt: 'account_updated',
    modelName: 'Account',
  });
  return Account;
}