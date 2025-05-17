import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User.model';
import Classroom from './Classroom.model';

@Table({
    tableName: 'chat_messages'
})
class ChatMessage extends Model {
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Classroom)
    @Column({ type: DataType.INTEGER })
    classroomId: number;

    @BelongsTo(() => Classroom)
    classroom: Classroom;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    message: string;
}

export default ChatMessage;
