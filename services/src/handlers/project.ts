import { Request, Response } from "express"
import Project from "../models/Project.model"
import Classroom from "../models/Classroom.model"
import User from "../models/User.model"

export const getProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.findAll({
            include: [{
                model: Classroom,
                attributes: ["id", "name"],
                include: [{
                  model: User,
                  attributes: ["id", "name"]
                }]
            }]
        })

        const data = projects.map(p => ({
            id: p.id,
            name: p.name,
            classes: p.classrooms ? p.classrooms.map(c => ({
              id: c.id,
              name: c.name,
              users: c.users
            })) : []
        }))
        res.json({ data })
    } catch (error) {
        res.status(500).json({ error: "Failed to load projects" })
    }
}

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const project = await Project.findByPk(id)

        if (!project) {
            res.status(404).json({ error: 'Project not found' })
            return
        }

        res.json({ data: project })
    } catch (error) {
        console.log(error)
    }
}

export const createProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.create(req.body)
        res.json({ data: project })
    } catch (error) {
        console.log(error)
    }
}

export const updateProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const project = await Project.findByPk(id)

        if (!project) {
            res.status(404).json({ error: 'Project not found' })
            return
        }

        await project.update(req.body)
        await project.save()

        res.json({ data: project })
    } catch (error) {
        console.log(error)
    }
}

export const updateProjectName = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { name } = req.body
        const project = await Project.findByPk(id)

        if (!project) {
            res.status(404).json({ error: 'Project not found' })
            return
        }

        if (!name) {
            res.status(400).json({ error: 'Invalid name' })
            return
        }

        project.name = name
        await project.save()

        res.json({ data: project })
    } catch (error) {
        console.log(error)
    }
}

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const project = await Project.findByPk(id)

        if (!project) {
            res.status(404).json({ error: 'Project not found' })
            return
        }

        await project.destroy()
        res.json({ data: 'Project deleted' })
    } catch (error) {
        console.log(error)
    }
}