import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { authFetch } from "../utils/authFetch"

const socket = io(import.meta.env.VITE_SOCKET_URL)

export default function LiveChat({ classroomId, user }) {
  const [onlineUsers, setOnlineUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  // Fetch all users of the classroom
  useEffect(() => {
    if (!classroomId) return
    authFetch(`/classrooms/${classroomId}/users`)
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

  const disconnected = allUsers.filter(
    u => !onlineUsers.some(ou => ou.id === u.id)
  )

  return (
    <div className="w-2/3 bg-white/80 dark:bg-[#2d334a]/80 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl flex flex-col shadow-2xl backdrop-blur-md">
      <div className="mb-4">
        <h4 className="text-xl font-bold text-gray-700 dark:text-white mb-2">🟢 Online</h4>
        <ul className="flex flex-wrap gap-2">
          {onlineUsers.map(u => (
            <li key={u.id} className="p-2 bg-green-200 dark:bg-green-700 text-gray-800 dark:text-white rounded">{u.name}</li>
          ))}
        </ul>
        <h4 className="text-xl font-bold text-gray-700 dark:text-white mt-4 mb-2">🔴 Disconnected</h4>
        <ul className="flex flex-wrap gap-2 opacity-70">
          {disconnected.map(u => (
            <li key={u.id} className="p-2 bg-red-200 dark:bg-red-700 text-gray-800 dark:text-white rounded">{u.name}</li>
          ))}
        </ul>
      </div>
      <div className="h-64 overflow-y-auto space-y-4 flex-1 bg-gray-100 dark:bg-gray-900 rounded-lg p-2 mb-2">
        {messages.map((msg, i) => (
          <div key={i} className="p-2">
            <span className="font-bold text-default dark:text-white">{msg.user}: </span>
            <span className="text-gray-800 dark:text-gray-100">{msg.message}</span>
          </div>
        ))}
      </div>
      <div className="flex space-x-2 mt-2">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") sendMessage() }}
        />
        <button className="bg-secundary text-white px-4 py-2 rounded-lg" onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}