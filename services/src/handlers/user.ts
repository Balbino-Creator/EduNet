import { Request, Response } from "express"
import bcrypt from "bcrypt"
import User, { UserRole } from "../models/User.model"
import Classroom from "../models/Classroom.model"

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
        const { name, last_names, password, role, classroomId } = req.body

        if (role === UserRole.STUDENT) {
            if (!password) {
                res.status(400).json({ error: "Password is required for students." })
                return
            }
            const existingUser = await User.findOne({ where: { name } })
            if (existingUser) {
                res.status(400).json({ error: "A user with this username already exists." })
                return
            }
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            const user = await User.create({
                name,
                last_names,
                role,
                password: hashedPassword,
                confirmed: true,
                uid: name
            })
            if (classroomId) {
                const classroom = await Classroom.findByPk(classroomId)
                if (classroom) {
                    await user.$add("classrooms", classroom)
                }
            }
            res.json({ data: user })
            return
        }

        res.status(400).json({ error: "Only students can be created here." })
    } catch (error) {
        console.error("Error creating user:", error)
        res.status(500).json({ error: "Failed to create user" })
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

        if (user.role === UserRole.STUDENT) {
            const updateData: any = { ...req.body, confirmed: true }
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10)
                updateData.password = await bcrypt.hash(req.body.password, salt)
            } else {
                delete updateData.password
            }
            if (req.body.name) {
                updateData.uid = req.body.name
            }
            await user.update(updateData)
            await user.save()
            res.json({data: user})
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