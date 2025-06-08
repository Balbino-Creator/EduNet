import { Table, Column, Model, DataType, Unique, AllowNull, Default, BelongsToMany, BeforeValidate } from 'sequelize-typescript'
import Classroom from './Classroom.model'
import UserClassroom from './UserClassroom.model'

export enum UserRole {
    TEACHER = 'teacher',
    STUDENT = 'student'
}

@Table({
    tableName: 'users'
})
class User extends Model {
    @Unique
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
    declare role: UserRole

    @Unique
    @AllowNull(true)
    @Column({
        type: DataType.STRING(100),
        validate: {
            isEmail: true,
        }
    })
    declare email: string | null

    @AllowNull(true)
    @Column({
        type: DataType.STRING,
    })
    declare password: string | null

    @Default(false)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    declare confirmed: boolean

    @BelongsToMany(() => Classroom, () => UserClassroom)
    declare classrooms: Classroom[]

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    declare uid: string

    @BeforeValidate
    static validateRoleFields(instance: User) {
        if (instance.role === UserRole.STUDENT) {
            if (instance.email) {
                throw new Error('Students must not have an email address.')
            }
            if (!instance.password) {
                throw new Error('Students must have a password.')
            }
        }

        if (instance.role === UserRole.TEACHER) {
            if (!instance.email) {
                throw new Error('Teachers must have an email address.')
            }
        }
    }
}

export default User