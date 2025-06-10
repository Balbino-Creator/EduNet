import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { useAppContext } from "../contexts/AppContext"
import { useEffect, useState } from "react"
import { authFetch } from "../utils/authFetch"

export default function Layout() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { t, darkMode } = useAppContext()

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

  if (loading) return <div className="flex items-center justify-center h-screen text-3xl text-primary animate-pulse">Loading...</div>

  const isLoggedIn = !!userData

  return (
    <div className={`flex h-screen transition-colors duration-500 ${darkMode ? "bg-[#232946]" : ""}`}>
      <aside className={`w-80 pl-12 pt-12 shadow-2xl rounded-tr-3xl rounded-br-3xl flex flex-col text-primary animate-slide-in-left transition-all duration-700
        ${darkMode ? "bg-[#232946]/90 text-white" : "bg-white/80"}`}>
        <h2 className="uppercase text-5xl mb-16 font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary drop-shadow-lg select-none">
          EduNet
        </h2>
        <nav className="flex-1">
          <ul className="flex flex-col space-y-5 justify-center h-full font-bold text-xl">
            {!isLoggedIn && (
              <>
                <Link to={"/"}>
                  <li className={location.pathname === "/" ? "underline" : ""}>
                    {t("login")}
                  </li>
                </Link>
                <Link to={"/register-teacher"}>
                  <li className={location.pathname === "/register-teacher" ? "underline" : ""}>
                    {t("registerTeacher")}
                  </li>
                </Link>
              </>
            )}
            {isLoggedIn && (
              <>
                <Link to={"/home"}>
                  <li className={location.pathname === "/home" ? "underline" : ""}>
                    {t("home")}
                  </li>
                </Link>
                <Link to={"/projects"}>
                  <li className={location.pathname === "/projects" ? "underline" : ""}>
                    {t("projects")}
                  </li>
                </Link>
                <Link to={"/live-code"}>
                  <li className={location.pathname === "/live-code" ? "underline" : ""}>
                    {t("liveCode")}
                  </li>
                </Link>
                <Link to={"/settings"}>
                  <li className={location.pathname === "/settings" ? "underline" : ""}>
                    {t("settings")}
                  </li>
                </Link>
              </>
            )}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-10 md:p-20 overflow-y-auto transition-all duration-500">
        <Outlet />
      </main>
    </div>
  )
}
