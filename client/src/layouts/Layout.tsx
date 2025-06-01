import { Outlet, Link, useLocation } from "react-router-dom"

export default function Layout() {
  const isLoggedIn = !!localStorage.getItem("token")
  const location = useLocation()

  return (
    <div className="flex h-screen">
      <aside className="w-80 pl-12 pt-12 bg-primary flex flex-col text-white">
        <h2 className="uppercase text-6xl mb-16 font-bold underline">EduNet</h2>
        <nav className="flex-1">
          <ul className="flex flex-col space-y-5 justify-center h-fulf font-bold text-xl">
            {!isLoggedIn && (
              <Link to={"/"}>
                <li className={location.pathname === "/" ? "underline" : ""}>
                  Login
                </li>
              </Link>
            )}
            {!isLoggedIn && (
              <Link to={"/register-teacher"}>
                <li className={location.pathname === "/register-teacher" ? "underline" : ""}>
                  Register as Teacher
                </li>
              </Link>
            )}
            {isLoggedIn && (
              <>
                <Link to={"/home"}>
                  <li className={location.pathname === "/home" ? "underline" : ""}>
                    Home
                  </li>
                </Link>
                <Link to={"/projects"}>
                  <li className={location.pathname === "/projects" ? "underline" : ""}>
                    Projects
                  </li>
                </Link>
                <Link to={"/live-code"}>
                  <li className={location.pathname === "/live-code" ? "underline" : ""}>
                    Live Code
                  </li>
                </Link>
                <Link to={"/settings"}>
                  <li className={location.pathname === "/settings" ? "underline" : ""}>
                    Settings
                  </li>
                </Link>
              </>
            )}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-20">
        <Outlet />
      </main>
    </div>
  )
}
