import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Project from './Project.model';
import User from './User.model';
import ChatMessage from './ChatMessage.model';

@Table({
    tableName: 'classrooms'
})
class Classroom extends Model {
    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    declare name: string

    @ForeignKey(() => Project)
    @Column({ type: DataType.INTEGER })
    declare projectId: number

    @BelongsTo(() => Project)
    declare project: Project

    @HasMany(() => User)
    declare users: User[]

    @HasMany(() => ChatMessage)
    declare chatMessages: ChatMessage[]
}

export default Classroom