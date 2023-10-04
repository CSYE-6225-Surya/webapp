import { Model } from 'sequelize'
export default (sequelize, DataTypes) => {
  class Assignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Assignment.init({
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    points: { type: DataTypes.INTEGER, allowNull: false },
    num_of_attempts: { type: DataTypes.INTEGER, allowNull: false },
    deadline: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.STRING, allowNull: false }
  }, {
    sequelize,
    timestamps: true,
    createdAt: 'assignment_created',
    updatedAt: 'assignment_updated',
    modelName: 'Assignment',
  });
  return Assignment;
};