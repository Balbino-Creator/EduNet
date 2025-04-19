import { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const [projectsData, setProjectsData] = useState(null)

  useEffect(() => {
    fetch("./src/ejemplos.json")
      .then(response => response.json())
      .then(data => setProjectsData(data));
  }, [])

  if (!projectsData) return <p>Cargando proyectos...</p>

  return (
    <>
      <h3 className="page-title text-default">Projects</h3>
      <div className="grid grid-cols-3 gap-4 mt-12">
        {projectsData.projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </>
  )
}
