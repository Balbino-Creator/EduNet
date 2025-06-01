import dotenv from "dotenv";
dotenv.config();
import express from 'express'
import router from './router'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, { swaggerUiOptions } from './config/swagger'
import db from './config/db'
import cors from "cors"

async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        console.log('Successful connection to the database')
    } catch (error) {
        console.log(error)
        console.log('There was an error trying to connect to the database.')
    }
}

connectDB()

const server = express()

server.use(cors({ origin: "http://localhost:5173", credentials: true }))

// Read data
server.use(express.json())

server.use('/api/', router)

// Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server