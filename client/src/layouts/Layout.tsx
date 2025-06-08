import { useEffect, useState } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { authFetch } from "../utils/authFetch"

export default function Layout() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Only fetch user if not on login or register
    if (location.pathname === "/" || location.pathname === "/register-teacher") {
      setLoading(false)
      return
    }
    const token = localStorage.getItem("token")
    if (!token) {
      setUserData(null)
      setLoading(false)
      return
    }
    authFetch("http://localhost:4000/api/me")
      .then(res => res && res.json())
      .then(data => {
        if (data && data.data) setUserData(data.data)
        else {
          setUserData(null)
          navigate("/")
        }
        setLoading(false)
      })
      .catch(() => {
        setUserData(null)
        setLoading(false)
        navigate("/")
      })
  }, [location.pathname, navigate])

  if (loading) return <div>Loading...</div>

  const isLoggedIn = !!userData

  return (
    <div className="flex h-screen">
      <aside className="w-80 pl-12 pt-12 bg-primary flex flex-col text-white">
        <h2 className="uppercase text-6xl mb-16 font-bold underline">EduNet</h2>
        <nav className="flex-1">
          <ul className="flex flex-col space-y-5 justify-center h-fulf font-bold text-xl">
            {!isLoggedIn && (
              <>
                <Link to={"/"}>
                  <li className={location.pathname === "/" ? "underline" : ""}>
                    Login
                  </li>
                </Link>
                <Link to={"/register-teacher"}>
                  <li className={location.pathname === "/register-teacher" ? "underline" : ""}>
                    Register as Teacher
                  </li>
                </Link>
              </>
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
