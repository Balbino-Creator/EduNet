import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { authFetch } from "../utils/authFetch"

const socket = io("http://localhost:4000")

export default function LiveChat({ classroomId, user }) {
  const [onlineUsers, setOnlineUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  // Fetch all users of the classroom
  useEffect(() => {
    if (!classroomId) return
    authFetch(`http://localhost:4000/api/classrooms/${classroomId}/users`)
      .then(res => res && res.json())
      .then(data => setAllUsers(data.users || []))
  }, [classroomId])

  // Socket.io logic
  useEffect(() => {
    if (!classroomId || !user) return
    socket.emit("joinClassroom", { classroomId, user })
    socket.on("users", setOnlineUsers)
    socket.on("chatHistory", setMessages)
    socket.on("chatMessage", msg => setMessages(m => [...m, msg]))
    return () => {
      socket.emit("leaveClassroom", { classroomId, user })
      socket.off("users")
      socket.off("chatHistory")
      socket.off("chatMessage")
    }
  }, [classroomId, user])

  const sendMessage = () => {
    if (!input.trim()) return
    socket.emit("chatMessage", {
      classroomId,
      message: { user: user.name, text: input },
      userId: user.id
    })
    setInput("")
  }

  // Calcula desconectados
  const disconnected = allUsers.filter(
    u => !onlineUsers.some(ou => ou.id === u.id)
  )

  return (
    <div className="w-2/3 bg-white p-4 rounded-2xl flex flex-col">
      <div className="mb-4">
        <h4 className="text-xl text-gray-700 mb-2">🟢 Online</h4>
        <ul className="flex flex-wrap gap-2">
          {onlineUsers.map(u => (
            <li key={u.id} className="p-2 bg-green-200 rounded">{u.name}</li>
          ))}
        </ul>
        <h4 className="text-xl text-gray-700 mt-4 mb-2">🔴 Disconnected</h4>
        <ul className="flex flex-wrap gap-2 opacity-70">
          {disconnected.map(u => (
            <li key={u.id} className="p-2 bg-red-200 rounded">{u.name}</li>
          ))}
        </ul>
      </div>
      <div className="h-64 overflow-y-auto space-y-4 flex-1 bg-gray-100 rounded-lg p-2 mb-2">
        {messages.map((msg, i) => (
          <div key={i} className="p-2">
            <span className="font-bold text-default">{msg.user}: </span>
            {msg.message}
          </div>
        ))}
      </div>
      <div className="flex space-x-2 mt-2">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg text-default"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") sendMessage() }}
        />
        <button className="bg-secundary text-white px-4 py-2 rounded-lg" onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}