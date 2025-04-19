import { useState, useEffect } from "react";
import Chat from "../components/Chat";
import CodeSnippet from "../components/CodeSnippet";
import Participants from "../components/Participants";

export default function LiveCode() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("./src/ejemplos.json")
      .then(response => response.json())
      .then(json => setData(json.liveCode));
  }, []);

  if (!data) return <p>Cargando datos...</p>;

  return (
    <>
      <div className="flex flex-col h-full">
        <section className="mb-12">
          <h3 className="page-title text-default">Live Code</h3>
        </section>
        <div className="flex space-x-6 h-full">

          {/* Chat principal */}
          <Chat messages={data.messages} />

          {/* Código compartido en vivo */}
          <CodeSnippet code={data.liveCodeSnippet} />

          {/* Lista de participantes */}
          <Participants active={data.participants.active} disconnected={data.participants.disconnected} />
        </div>
      </div>
    </>
  )
}
