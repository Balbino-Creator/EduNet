export default function LiveCode() {
  return (
    <>
      <div className="flex flex-col h-full">
        <section className="mb-12">
          <h3 className="page-title text-default">Live Code</h3>
        </section>
        <div className="flex space-x-6 h-full">

          {/* Chat principal */}
          <div className="w-2/3 bg-white p-4 rounded-2xl flex flex-col">
            <div className="h-64 overflow-y-auto space-y-4 flex-1">
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-gray-400 text-md">
                  <span className="font-bold text-default">Usuario 1: </span>
                    Hola, ¿listos para programar?
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-gray-400 text-md">
                  <span className="font-bold text-default">Usuario 2: </span>
                    ¡Sí! Comparte el código.
                </p>
              </div>
            </div>

            {/* Input para mensajes */}
            <div className="flex space-x-2 mt-4">
              <input type="text" className="flex-grow p-2 border rounded-lg text-default" placeholder="Escribe un mensaje..." />
              <button className="bg-secundary text-white px-4 py-2 rounded-lg">Enviar</button>
            </div>
          </div>

          {/* Código compartido en vivo */}
          <div className="w-2/3 bg-white p-4 rounded-2xl flex flex-col">
            <h4 className="text-xl text-gray-700 mb-2">Código en vivo</h4>
            <div className="h-64 bg-gray-500 text-white p-4 rounded-lg overflow-y-auto flex-1">
              <pre className="whitespace-pre-wrap">
                {/* Aquí se mostrará el código en vivo dinámicamente */}
                <code id="liveCode">Esperando cambios...</code>
              </pre>
            </div>
          </div>

          {/* Lista de participantes */}
          <div className="w-1/3 bg-primary p-4 rounded-2xl">
            <h4 className="text-xl text-white mb-4">Participantes</h4>

            {/* Activos */}
            <div className="mb-6">
              <h5 className="text-lg text-white">🟢 Activos</h5>
              <ul className="mt-2 space-y-2">
                <li className="p-2 bg-white text-black rounded-lg">Usuario 1</li>
                <li className="p-2 bg-white text-black rounded-lg">Usuario 2</li>
                <li className="p-2 bg-white text-black rounded-lg">Usuario 3</li>
              </ul>
            </div>

            {/* Desconectados */}
            <div>
              <h5 className="text-lg text-white">🔴 Desconectados</h5>
              <ul className="mt-2 space-y-2 opacity-70">
                <li className="p-2 bg-white text-black rounded-lg">Usuario 4</li>
                <li className="p-2 bg-white text-black rounded-lg">Usuario 5</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
