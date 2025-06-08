'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'classroomId')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'classroomId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'classrooms',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    })
  }
}