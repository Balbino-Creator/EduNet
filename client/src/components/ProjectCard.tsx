import { useState } from "react"

export default function ProjectCard({ project }) {
    const [isOpen, setIsOpen] = useState(false)
    const classes = project.classes || []

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
