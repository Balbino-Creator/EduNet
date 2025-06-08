'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Try to remove the constraint first, if it exists
    // If it does not exist, catch the error and ignore it
    try {
      await queryInterface.removeConstraint('classrooms', 'classrooms_projectId_fkey');
    } catch (e) {
      // Nothing to do here, just ignore the error if the constraint does not exist
    }
    await queryInterface.addConstraint('classrooms', {
      fields: ['projectId'],
      type: 'foreign key',
      name: 'classrooms_projectId_fkey',
      references: {
        table: 'projects',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.removeConstraint('users', 'users_classroomId_fkey');
    await queryInterface.addConstraint('users', {
      fields: ['classroomId'],
      type: 'foreign key',
      name: 'users_classroomId_fkey',
      references: {
        table: 'classrooms',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('classrooms', 'classrooms_projectId_fkey');
    await queryInterface.addConstraint('classrooms', {
      fields: ['projectId'],
      type: 'foreign key',
      name: 'classrooms_projectId_fkey',
      references: {
        table: 'projects',
        field: 'id'
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE'
    });
    await queryInterface.removeConstraint('users', 'users_classroomId_fkey');
    await queryInterface.addConstraint('users', {
      fields: ['classroomId'],
      type: 'foreign key',
      name: 'users_classroomId_fkey',
      references: {
        table: 'classrooms',
        field: 'id'
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE'
    });
  }
};
