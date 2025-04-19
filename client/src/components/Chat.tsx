export default function Chat({ messages }) {
    return (
      <div className="w-2/3 bg-white p-4 rounded-2xl flex flex-col">
        <div className="h-64 overflow-y-auto space-y-4 flex-1">
          {messages.map((msg, index) => (
            <div key={index} className="p-3 bg-gray-100 rounded-lg">
              <p className="text-gray-400 text-md">
                <span className="font-bold text-default">{msg.user}: </span>
                {msg.message}
              </p>
            </div>
          ))}
        </div>

        {/* Input para mensajes */}
        <div className="flex space-x-2 mt-4">
          <input type="text" className="flex-grow p-2 border rounded-lg text-default" placeholder="Escribe un mensaje..." />
          <button className="bg-secundary text-white px-4 py-2 rounded-lg">Enviar</button>
        </div>
      </div>
    )
  }