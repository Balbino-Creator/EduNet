import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Classroom from './Classroom.model';

@Table({ tableName: 'live_code_files' })
class LiveCodeFile extends Model {
  @ForeignKey(() => Classroom)
  @Column({ type: DataType.INTEGER })
  declare classroomId: number;

  @BelongsTo(() => Classroom)
  declare classroom: Classroom;

  @Column({ type: DataType.STRING, allowNull: false })
  declare filename: string;

  @Column({ type: DataType.TEXT, allowNull: false, defaultValue: '' })
  declare content: string;
}

export default LiveCodeFile;