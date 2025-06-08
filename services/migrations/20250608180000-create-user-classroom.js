'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_classrooms', {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      classroomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'classrooms',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    })
    await queryInterface.addConstraint('user_classrooms', {
      fields: ['userId', 'classroomId'],
      type: 'primary key',
      name: 'user_classrooms_pkey'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_classrooms')
  }
}