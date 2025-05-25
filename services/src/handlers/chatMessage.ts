import { Request, Response } from "express"
import ChatMessage from "../models/ChatMessage.model"

export const getChatMessages = async (req: Request, res: Response) => {
    try {
        const chatMessages = await ChatMessage.findAll()
        res.json({ data: chatMessages })
    } catch (error) {
        console.log(error)
    }
}

export const getChatMessageById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const chatMessage = await ChatMessage.findByPk(id, {
            include: ['user', 'classroom'] // Cargando relaciones
        })

        if (!chatMessage) {
            res.status(404).json({ error: 'Chat message not found' })
            return
        }

        res.json({ data: chatMessage })
    } catch (error) {
        console.log(error)
    }
}

export const createChatMessage = async (req: Request, res: Response) => {
    try {
        const chatMessage = await ChatMessage.create(req.body)
        res.json({ data: chatMessage })
    } catch (error) {
        console.log(error)
    }
}

export const updateChatMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const chatMessage = await ChatMessage.findByPk(id)

        if (!chatMessage) {
            res.status(404).json({ error: 'Chat message not found' })
            return
        }

        await chatMessage.update(req.body)
        await chatMessage.save()

        res.json({ data: chatMessage })
    } catch (error) {
        console.log(error)
    }
}

export const updateMessageContent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { message } = req.body
        const chatMessage = await ChatMessage.findByPk(id)

        if (!chatMessage) {
            res.status(404).json({ error: 'Chat message not found' })
            return
        }

        if (!message) {
            res.status(400).json({ error: 'Invalid message' })
            return
        }

        chatMessage.message = message
        await chatMessage.save()

        res.json({ data: chatMessage })
    } catch (error) {
        console.log(error)
    }
}

export const deleteChatMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const chatMessage = await ChatMessage.findByPk(id)

        if (!chatMessage) {
            res.status(404).json({ error: 'Chat message not found' })
            return
        }

        await chatMessage.destroy()
        res.json({ data: 'Chat message deleted' })
    } catch (error) {
        console.log(error)
    }
}