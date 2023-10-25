export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Assignments', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            points: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            num_of_attempts: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            deadline: {
                allowNull: false,
                type: Sequelize.DATE
            },
            userId: {
                allowNull: false,
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