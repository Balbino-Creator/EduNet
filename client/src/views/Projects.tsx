import { useAppContext } from "../contexts/AppContext";
import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const { t } = useAppContext();
  const [projectsData, setProjectsData] = useState<any[]>(null);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    authFetch("http://localhost:4000/api/me")
      .then(response => response && response.json())
      .then(data => setUserData(data.data))
      .catch(() => setError("Failed to load user data"));
  }, []);

  useEffect(() => {
    authFetch("http://localhost:4000/api/projects")
      .then(response => response && response.json())
      .then(data => setProjectsData(data.data))
      .catch(() => setError("Failed to load projects"));
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!projectsData || !userData) return <p>{t("loadingData")}</p>;

  let filteredProjects = projectsData;
  if (userData.role === "student") {
    filteredProjects = projectsData
      .map(project => ({
        ...project,
        classes: (project.classes || []).filter(classroom =>
          classroom.users?.some(u => u.id === userData.id)
        )
      }))
      .filter(project => project.classes.length > 0);
  }

  return (
    <div className="animate-fade-in">
      <h3 className="page-title text-default">{t("projects")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {filteredProjects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
}
