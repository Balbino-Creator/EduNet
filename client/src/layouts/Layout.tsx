import { Outlet, Link } from "react-router-dom"

export default function Layout() {
  return (
    <>
      <div className="flex h-screen">
        <aside className="w-80 pl-12 pt-12 bg-primary flex flex-col text-white">
          <h2 className="uppercase text-6xl mb-16 font-bold underline">EduNet</h2>
          <nav className="flex-1">
            <ul className="flex flex-col space-y-5 justify-center h-fulf font-bold text-xl">
              <Link to={"/"}>
                <li>
                  <a href="">Login</a>
                </li>
              </Link>
              <Link to={"home"}>
                <li>
                  <a href="">Home</a>
                </li>
              </Link>
              <Link to={"projects"}>
                <li>
                  <a href="">Projects</a>
                </li>
              </Link>
              <Link to={"live-code"}>
                <li>
                  <a href="">Live Code</a>
                </li>
              </Link>
              <Link to={"settings"}>
                <li>
                  <a href="">Settings</a>
                </li>
              </Link>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-20">
          <Outlet />
        </main>
      </div>
    </>
  )
}
