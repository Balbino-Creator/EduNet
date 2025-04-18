export default function Projects() {
  return (
    <>
      <h3 className="page-title text-default">Projects</h3>
      <div className="grid grid-cols-3 gap-4 mt-12">
        {/* Proyecto 1 */}
        <div className="group w-full space-y-6">
          <button className="w-full bg-secundary text-4xl font-bold text-white px-6 py-4 rounded-2xl">
            Project 1
          </button>
          <ul className="mx-auto bg-tertiary rounded-2xl hidden group-focus-within:block w-4/5">
            <li className="px-6 py-4 text-white text-2xl font-bold">Clase 1</li>
            <li className="px-6 py-4 text-white text-2xl font-bold">Clase 2</li>
            <li className="px-6 py-4 text-white text-2xl font-bold">Clase 3</li>
          </ul>
        </div>

        {/* Proyecto 2 */}
        <div className="group w-full space-y-6">
          <button className="w-full bg-secundary text-4xl font-bold text-white px-6 py-4 rounded-2xl">
            Project 2
          </button>
          <ul className="mx-auto bg-tertiary rounded-2xl hidden group-focus-within:block w-4/5">
            <li className="px-6 py-4 text-white text-2xl font-bold">Clase A</li>
            <li className="px-6 py-4 text-white text-2xl font-bold">Clase B</li>
            <li className="px-6 py-4 text-white text-2xl font-bold">Clase C</li>
          </ul>
        </div>

        {/* Proyecto 3 */}
        <div className="group w-full space-y-6">
          <button className="w-full bg-secundary text-4xl font-bold text-white px-6 py-4 rounded-2xl">
            Project 3
          </button>
          <ul className="mx-auto bg-tertiary rounded-2xl hidden group-focus-within:block w-4/5">
            <li className="px-6 py-4 text-white text-2xl font-bold">Clase X</li>
            <li className="px-6 py-4 text-white text-2xl font-bold">Clase Z</li>
          </ul>
        </div>

        {/* Proyecto 4 */}
        <div className="group w-full space-y-6">
          <button className="w-full bg-secundary text-4xl font-bold text-white px-6 py-4 rounded-2xl">
            Project 4
          </button>
          <ul className="mx-auto bg-tertiary rounded-2xl hidden group-focus-within:block w-4/5">
            <li className="px-6 py-4 text-white text-2xl font-bold">Clase M</li>
            <li className="px-6 py-4 text-white text-2xl font-bold">Clase N</li>
            <li className="px-6 py-4 text-white text-2xl font-bold">Clase O</li>
          </ul>
        </div>
        {/* Proyecto 5 */}
        <div className="group w-full space-y-6">
          <button className="w-full bg-secundary text-4xl font-bold text-white px-6 py-4 rounded-2xl">
            Project 4
          </button>
          <ul className="mx-auto bg-tertiary rounded-2xl hidden group-focus-within:block w-4/5">
            <li className="px-6 py-4 text-white text-2xl font-bold">Clase M</li>
          </ul>
        </div>
      </div>
    </>
  )
}
