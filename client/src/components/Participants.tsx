export default function Participants({ active, disconnected }) {
    return (
      <div className="w-1/3 bg-primary p-4 rounded-2xl">
        <h4 className="text-xl text-white mb-4">Participantes</h4>

        {/* Activos */}
        <div className="mb-6">
          <h5 className="text-lg text-white">🟢 Activos</h5>
          <ul className="mt-2 space-y-2">
            {active.map((user, index) => (
              <li key={index} className="p-2 bg-white text-black rounded-lg">{user}</li>
            ))}
          </ul>
        </div>

        {/* Desconectados */}
        <div>
          <h5 className="text-lg text-white">🔴 Desconectados</h5>
          <ul className="mt-2 space-y-2 opacity-70">
            {disconnected.map((user, index) => (
              <li key={index} className="p-2 bg-white text-black rounded-lg">{user}</li>
            ))}
          </ul>
        </div>
      </div>
    )
}
