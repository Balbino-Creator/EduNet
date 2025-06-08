import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Project from './Project.model';
import User from './User.model';
import ChatMessage from './ChatMessage.model';
import LiveCodeFile from './LiveCodeFile.model';

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
    @Column({ type: DataType.INTEGER, onDelete: 'CASCADE' })
    declare projectId: number

    @BelongsTo(() => Project)
    declare project: Project

    @HasMany(() => User)
    declare users: User[]

    @HasMany(() => ChatMessage)
    declare chatMessages: ChatMessage[]

    @HasMany(() => LiveCodeFile)
    declare liveCodeFiles: LiveCodeFile[]
}

export default Classroom