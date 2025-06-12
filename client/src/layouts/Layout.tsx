import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { useAppContext } from "../contexts/AppContext"
import { useEffect, useState } from "react"
import { authFetch } from "../utils/authFetch"

export default function Layout() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
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
    authFetch("/me")
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
      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      {/* Responsive sidebar/menu */}
      <aside className={`
        fixed z-40 top-0 left-0 h-full w-full md:w-80
        ${darkMode ? "bg-[#232946]/90 text-white" : "bg-white/80 text-primary"}
        shadow-2xl rounded-none md:rounded-tr-3xl md:rounded-br-3xl flex flex-col
        transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:pl-12 md:pt-12
        animate-slide-in-left
      `}>
        <button
          className="absolute top-4 right-4 md:hidden text-3xl"
          onClick={() => setMenuOpen(false)}
          aria-label="Cerrar menú"
        >
          &times;
        </button>
        <h2 className="uppercase text-4xl md:text-5xl mb-8 md:mb-16 font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary drop-shadow-lg select-none text-center md:text-left">
          EduNet
        </h2>
        <nav className="flex-1">
          <ul className={`
            flex flex-col md:flex-col
            space-y-5 justify-center items-center md:items-start
            h-full font-bold text-lg md:text-xl gap-4 md:gap-0
          `}>
            {!isLoggedIn && (
              <>
                <Link to={"/"} onClick={() => setMenuOpen(false)}>
                  <li className={location.pathname === "/" ? "underline" : ""}>
                    {t("login")}
                  </li>
                </Link>
                <Link to={"/register-teacher"} onClick={() => setMenuOpen(false)}>
                  <li className={location.pathname === "/register-teacher" ? "underline" : ""}>
                    {t("registerTeacher")}
                  </li>
                </Link>
              </>
            )}
            {isLoggedIn && (
              <>
                <Link to={"/home"} onClick={() => setMenuOpen(false)}>
                  <li className={location.pathname === "/home" ? "underline" : ""}>
                    {t("home")}
                  </li>
                </Link>
                <Link to={"/projects"} onClick={() => setMenuOpen(false)}>
                  <li className={location.pathname === "/projects" ? "underline" : ""}>
                    {t("projects")}
                  </li>
                </Link>
                <Link to={"/live-code"} onClick={() => setMenuOpen(false)}>
                  <li className={location.pathname === "/live-code" ? "underline" : ""}>
                    {t("liveCode")}
                  </li>
                </Link>
                <Link to={"/settings"} onClick={() => setMenuOpen(false)}>
                  <li className={location.pathname === "/settings" ? "underline" : ""}>
                    {t("settings")}
                  </li>
                </Link>
              </>
            )}
          </ul>
        </nav>
      </aside>
      {/* Hamburger button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-white rounded-full p-2 shadow-lg"
        onClick={() => setMenuOpen(true)}
        aria-label="Abrir menú"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <main className="flex-1 p-4 sm:p-8 md:p-10 lg:p-20 overflow-y-auto transition-all duration-500">
        <Outlet />
      </main>
    </div>
  )
}
