import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User.model';
import Classroom from './Classroom.model';

@Table({
    tableName: 'chat_messages'
})
class ChatMessage extends Model {
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    declare userId: number

    @BelongsTo(() => User)
    declare user: User

    @ForeignKey(() => Classroom)
    @Column({ type: DataType.INTEGER })
    declare classroomId: number

    @BelongsTo(() => Classroom)
    declare classroom: Classroom

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare message: string
}

export default ChatMessage
