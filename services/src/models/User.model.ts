import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Classroom from './Classroom.model';

export enum UserRole {
    TEACHER = 'teacher',
    STUDENT = 'student'
}

@Table({
    tableName: 'users'
})
class User extends Model {
    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    declare name: string

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare last_names: string

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        allowNull: false
    })
    declare role: UserRole;

    @ForeignKey(() => Classroom)
    @Column({ type: DataType.INTEGER })
    declare classroomId: number

    @BelongsTo(() => Classroom)
    declare classroom: Classroom
}

export default User