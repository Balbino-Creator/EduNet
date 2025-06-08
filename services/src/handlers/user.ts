import { Request, Response } from "express"
import User, { UserRole } from "../models/User.model"

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll()
        res.json({data: users})
    } catch (error) {
        console.log(error)
    }
}

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id
        const user = await User.findByPk(userId)
        if (!user) {
            res.status(404).json({ error: "User not found" })
            return
        }
        res.json({ data: user })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const user = await User.findByPk(id)

        if(!user){
            res.status(404).json({ error: 'User not found' })
            return
        }

        res.json({data: user})
    } catch (error) {
        console.log(error)
    }
}

export const createUser = async (req : Request, res : Response) => {
    try {
        const user = await User.create(req.body)
        res.json({data: user})
    } catch (error) {
        console.log(error)
    }
}

export const updtateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const user = await User.findByPk(id)

        if(!user){
            res.status(404).json({ error: 'User not found' })
            return
        }

        await user.update(req.body)
        await user.save()

        res.json({data: user})
    } catch (error) {
        console.log(error)
    }
}

export const updtateRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const user = await User.findByPk(id)

        if(!user){
            res.status(404).json({ error: 'User not found' })
            return
        }

        if (user.role !== UserRole.TEACHER && user.role !== UserRole.STUDENT) {
            res.status(400).json({ error: 'Invalid role' })
            return
        }

        user.role = user.role === UserRole.TEACHER ? UserRole.STUDENT : UserRole.TEACHER;
        await user.save()

        res.json({data: user})
    } catch (error) {
        console.log(error)
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const user = await User.findByPk(id)

        if(!user){
            res.status(404).json({ error: 'User not found' })
            return
        }

        await user.destroy()
        res.json({data: 'User deleted'})
    } catch (error) {
        console.log(error)
    }
}

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await User.findAll({ where: { role: "student" } });
    res.json({ data: students });
  } catch (error) {
    res.status(500).json({ error: "Failed to load students" });
  }
};