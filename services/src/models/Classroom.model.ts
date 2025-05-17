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
    name: string;

    @ForeignKey(() => Project)
    @Column({ type: DataType.INTEGER })
    projectId: number;

    @BelongsTo(() => Project)
    project: Project;

    @HasMany(() => User)
    users: User[];

    @HasMany(() => ChatMessage)
    chatMessages: ChatMessage[];
}

export default Classroom;