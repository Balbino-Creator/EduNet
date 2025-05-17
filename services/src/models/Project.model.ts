import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import Classroom from './Classroom.model';

@Table({
    tableName: 'projects'
})
class Project extends Model {
    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    name: string;

    @HasMany(() => Classroom)
    classrooms: Classroom[];
}

export default Project;
