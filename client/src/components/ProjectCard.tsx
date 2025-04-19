import { useState } from "react"

export default function ProjectCard({ project }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="group w-full space-y-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-secundary text-4xl font-bold text-white px-6 py-4 rounded-2xl"
        >
          {project.name}
        </button>
        {isOpen && (
          <ul className="mx-auto bg-tertiary rounded-2xl w-4/5">
            {project.classes.map((className, i) => (
              <li key={i} className="px-6 py-4 text-white text-2xl font-bold">
                {className}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
}
