export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Submissions', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            assignment_id: {
                allowNull: false,
                type: Sequelize.STRING
            },
            submission_url: {
                allowNull: false,
                type: Sequelize.STRING
            },
            submission_date: {
                allowNull: false,
                type: Sequelize.DATE
            },
            submission_updated: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Submissions');
    }
};