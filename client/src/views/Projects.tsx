import { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import { authFetch } from "../utils/authFetch";

export default function Projects() {
  const [projectsData, setProjectsData] = useState<any[]>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    authFetch("http://localhost:4000/api/projects")
      .then(response => response && response.json())
      .then(data => {
        if (data && data.error) setError(data.error)
        else setProjectsData(data.data)
      })
      .catch(() => setError("Failed to load projects"))
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!projectsData) return <p>Loading projects...</p>;

  return (
    <>
      <h3 className="page-title text-default">Projects</h3>
      <div className="grid grid-cols-3 gap-4 mt-12">
        {projectsData.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </>
  )
}
