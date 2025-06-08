import express from "express"
import http from "http"
import { Server } from "socket.io"
import router from "./router"
import ChatMessage from "./models/ChatMessage.model"
import User from "./models/User.model"

const app = express()
app.use(express.json())
app.use("/api", router)

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "*" } })

// Presence per classroom
const classroomUsers: Record<string, { socketId: string, user: { id: number, name: string } }[]> = {}

io.on("connection", socket => {
  socket.on("joinClassroom", async ({ classroomId, user }) => {
    socket.join(classroomId)
    if (!classroomUsers[classroomId]) classroomUsers[classroomId] = []
    // Avoid duplicates
    if (!classroomUsers[classroomId].some(u => u.user.id === user.id)) {
      classroomUsers[classroomId].push({ socketId: socket.id, user })
    }
    io.to(classroomId).emit("users", classroomUsers[classroomId].map(u => u.user))
    // Send historical messages
    const messages = await ChatMessage.findAll({
      where: { classroomId },
      include: [{ model: User, attributes: ["name"] }],
      order: [["createdAt", "ASC"]]
    })
    io.to(socket.id).emit("chatHistory", messages.map(msg => ({
      user: msg.user?.name || "Unknown",
      message: msg.message
    })))
  })

  socket.on("leaveClassroom", ({ classroomId, user }) => {
    socket.leave(classroomId)
    if (classroomUsers[classroomId]) {
      classroomUsers[classroomId] = classroomUsers[classroomId].filter(u => u.user.id !== user.id)
      io.to(classroomId).emit("users", classroomUsers[classroomId].map(u => u.user))
    }
  })

  socket.on("chatMessage", async ({ classroomId, message, userId }) => {
    // Save to database
    await ChatMessage.create({ classroomId, userId, message: message.text })
    io.to(classroomId).emit("chatMessage", { user: message.user, message: message.text })
  })

  socket.on("disconnect", () => {
    for (const classroomId in classroomUsers) {
      const before = classroomUsers[classroomId].length
      classroomUsers[classroomId] = classroomUsers[classroomId].filter(u => u.socketId !== socket.id)
      if (classroomUsers[classroomId].length !== before) {
        io.to(classroomId).emit("users", classroomUsers[classroomId].map(u => u.user))
      }
    }
  })
})

const port = process.env.PORT || 4000

server.listen(port, () => {
    console.log(`REST API at port ${port}`)
})