import { Model } from 'sequelize'
export default (sequelize, DataTypes) => {
    class Submission extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Submission.init({
        id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        assignment_id: { type: DataTypes.STRING, allowNull: false },
        submission_url: { type: DataTypes.STRING, allowNull: false }
    }, {
        sequelize,
        timestamps: true,
        createdAt: 'submission_date',
        updatedAt: 'submission_updated',
        modelName: 'Submission',
    });
    return Submission;
};