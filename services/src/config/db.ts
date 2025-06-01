import { Sequelize } from 'sequelize-typescript'

const db = new Sequelize(process.env.DATABASE_URL!, {
    models: [__dirname + '/../models/**/*.ts'],
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }

})

export default db