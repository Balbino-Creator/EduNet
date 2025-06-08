import { Request, Response } from "express"
import Classroom from "../models/Classroom.model"

export const getClassrooms = async (req: Request, res: Response) => {
    try {
        const classrooms = await Classroom.findAll()
        res.json({ data: classrooms })
    } catch (error) {
        console.log(error)
    }
}

export const getClassroomById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const classroom = await Classroom.findByPk(id, {
            include: ['project', 'users', 'chatMessages']
        })

        if (!classroom) {
            res.status(404).json({ error: 'Classroom not found' })
            return
        }

        res.json({ data: classroom })
    } catch (error) {
        console.log(error)
    }
}

export const createClassroom = async (req: Request, res: Response) => {
    try {
        const classroom = await Classroom.create(req.body)
        res.json({ data: classroom })
    } catch (error) {
        console.log(error)
    }
}

export const updateClassroom = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const classroom = await Classroom.findByPk(id)

        if (!classroom) {
            res.status(404).json({ error: 'Classroom not found' })
            return
        }

        await classroom.update(req.body)
        await classroom.save()

        res.json({ data: classroom })
    } catch (error) {
        console.log(error)
    }
}

export const updateClassroomName = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { name } = req.body
        const classroom = await Classroom.findByPk(id)

        if (!classroom) {
            res.status(404).json({ error: 'Classroom not found' })
            return
        }

        if (!name) {
            res.status(400).json({ error: 'Invalid name' })
            return
        }

        classroom.name = name
        await classroom.save()

        res.json({ data: classroom })
    } catch (error) {
        console.log(error)
    }
}

export const deleteClassroom = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const classroom = await Classroom.findByPk(id)

        if (!classroom) {
            res.status(404).json({ error: 'Classroom not found' })
            return
        }

        await classroom.destroy()
        res.json({ data: 'Classroom deleted' })
    } catch (error) {
        console.log(error)
    }
}