import { Table, Column, Model, ForeignKey } from 'sequelize-typescript'
import User from './User.model'
import Classroom from './Classroom.model'

@Table({
  tableName: 'user_classrooms',
  timestamps: false
})
class UserClassroom extends Model {
  @ForeignKey(() => User)
  @Column
  declare userId: number

  @ForeignKey(() => Classroom)
  @Column
  declare classroomId: number
}

export default UserClassroom