import { useState, useEffect } from "react";
import LiveChat from "../components/LiveChat";
import { authFetch } from "../utils/authFetch";
import ShareDirectory from "../components/ShareDirectory";
import FileBrowser from "../components/FileBrowser";
import { useAppContext } from "../contexts/AppContext";

export default function LiveCode() {
  const { t } = useAppContext();
  const [userClassrooms, setUserClassrooms] = useState<any[]>([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    authFetch("http://localhost:4000/api/classrooms")
      .then(res => res && res.json())
      .then(data => {
        setUserClassrooms(data.data || []);
        if (data.data && data.data.length > 0) setSelectedClassroomId(String(data.data[0].id));
      })
      .catch(() => setError("Failed to load classrooms"));
  }, []);

  useEffect(() => {
    authFetch("http://localhost:4000/api/me")
      .then(res => res && res.json())
      .then(data => setUserData(data.data))
      .catch(() => setError("Failed to load user data"));
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (userClassrooms.length === 0) return <p className="text-xl text-default">{t("noClassrooms") || "You are not assigned to any classroom"}</p>;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <section className="mb-12">
        <h3 className="page-title text-default">{t("liveCode")}</h3>
        <select
          className="border rounded px-3 py-2 mt-4 bg-white/80 dark:bg-gray-800 text-default dark:text-white shadow-md focus:ring-2 focus:ring-primary transition-all duration-300"
          value={selectedClassroomId}
          onChange={e => setSelectedClassroomId(e.target.value)}
        >
          {userClassrooms.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </section>
      {selectedClassroomId && userData && (
        <div className="flex space-x-6 h-full">
          <LiveChat classroomId={selectedClassroomId} user={userData} />
          {userData?.role === "teacher" && (
            <ShareDirectory onShared={() => window.location.reload()} />
          )}
          <FileBrowser />
        </div>
      )}
    </div>
  );
}
