import { useState, useEffect } from "react";
import Chat from "../components/Chat";
import Participants from "../components/Participants";
import { useParams } from "react-router-dom";

export default function LiveCode() {
  const { classroomId } = useParams();
  const [data, setData] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editFilename, setEditFilename] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:4000/api/live-code/${classroomId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => setData(data))
      .catch(() => setError("Failed to load live code data"));
  }, [classroomId]);

  const handleFileSelect = (filename: string) => {
    setSelectedFile(filename);
    const file = data.files.find((f: any) => f.filename === filename);
    setEditContent(file.content);
    setEditFilename(file.filename);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:4000/api/live-code/${classroomId}/file`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ filename: editFilename, content: editContent })
    });
    if (res.ok) {
      // Reload files
      const updated = await fetch(`http://localhost:4000/api/live-code/${classroomId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());
      setData(updated);
      setSelectedFile(editFilename);
    }
  };

  const handleDelete = async (filename: string) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:4000/api/live-code/${classroomId}/file/${filename}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    // Reload files
    const updated = await fetch(`http://localhost:4000/api/live-code/${classroomId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());
    setData(updated);
    setSelectedFile(null);
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p>Loading data...</p>;

  // Default values in case data is missing
  const files = data.files || [];
  const messages = data.messages || [];
  const participants = data.participants || { active: [], disconnected: [] };

  return (
    <div className="flex flex-col h-full">
      <section className="mb-12">
        <h3 className="page-title text-default">Live Code</h3>
      </section>
      <div className="flex space-x-6 h-full">
        <Chat messages={messages} classroomId={classroomId} />
        {/* Files and editor */}
        <div className="w-2/3 bg-white p-4 rounded-2xl flex flex-col">
          <h4 className="text-xl text-gray-700 mb-2">Shared Folder</h4>
          <div className="flex space-x-4">
            <ul className="w-1/3">
              {files.map((file: any) => (
                <li key={file.filename}>
                  <button
                    className={`block w-full text-left px-2 py-1 rounded ${selectedFile === file.filename ? "bg-tertiary text-white" : "bg-gray-200"}`}
                    onClick={() => handleFileSelect(file.filename)}
                  >
                    {file.filename}
                  </button>
                  {data.isTeacher && (
                    <button className="text-red-500 ml-2" onClick={() => handleDelete(file.filename)}>Delete</button>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex-1">
              {selectedFile && (
                <>
                  <input
                    className="w-full mb-2 border rounded px-2 py-1"
                    value={editFilename}
                    onChange={e => setEditFilename(e.target.value)}
                    disabled={!data.isTeacher}
                  />
                  <textarea
                    className="w-full h-64 border rounded p-2"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    readOnly={!data.isTeacher}
                  />
                  {data.isTeacher && (
                    <button className="bg-secundary text-white px-4 py-2 rounded mt-2" onClick={handleSave}>
                      Save
                    </button>
                  )}
                </>
              )}
              {!selectedFile && <p>Select a file to view its content.</p>}
            </div>
          </div>
          {data.isTeacher && (
            <button
              className="bg-primary text-white px-4 py-2 rounded mt-4"
              onClick={() => {
                setEditFilename("newFile.js");
                setEditContent("");
                setSelectedFile("newFile.js");
              }}
            >
              New file
            </button>
          )}
        </div>
        {/* Participants */}
        <Participants
          active={participants.active || []}
          disconnected={participants.disconnected || []}
        />
      </div>
    </div>
  );
}
