import { useState } from "react"

export default function ProjectCard({ project }) {
  const [isOpen, setIsOpen] = useState(false)
  const classes = project.classes || []

  return (
    <div className="group w-full space-y-6 transition-transform duration-300 hover:scale-105">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/80 dark:bg-[#232946]/80 text-3xl font-bold text-primary dark:text-tertiary px-6 py-4 rounded-2xl shadow-lg border-2 border-primary hover:bg-primary hover:text-white transition-all duration-300"
      >
        {project.name}
      </button>
      {isOpen && (
        <ul className="mx-auto bg-tertiary/90 rounded-2xl w-4/5 shadow-lg animate-fade-in">
          {classes.length === 0 ? (
            <li className="px-6 py-4 text-white text-2xl font-bold opacity-60">
              No classrooms yet
            </li>
          ) : (
            classes.map((classroom, i) => (
              <li key={classroom.id} className="px-6 py-4 text-white text-2xl font-bold">
                {classroom.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
