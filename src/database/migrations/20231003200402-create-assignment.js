
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Assignments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      points: {
        type: Sequelize.INTEGER
      },
      num_of_attempts: {
        type: Sequelize.INTEGER
      },
      deadline: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING
      },
      assignment_created: {
        allowNull: false,
        type: Sequelize.DATE
      },
      assignment_updated: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Assignments');
  }
};