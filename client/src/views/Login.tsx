import { useState } from "react"
import { useAppContext } from "../contexts/AppContext"

export default function Login() {
  const { t } = useAppContext()
  const [role, setRole] = useState<"teacher" | "student" | null>(null)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleRoleSelect = (selectedRole: "teacher" | "student") => {
    setRole(selectedRole)
    setIdentifier("")
    setPassword("")
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.error === "Invalid credentials") setError(t("invalidCredentials"))
        else if (data.error?.includes("LDAP authentication failed")) setError(t("ldapFailed"))
        else setError(data.error || t("invalidCredentials"))
        return
      }
      localStorage.setItem("token", data.token)
      window.location.href = "/home"
    } catch (err) {
      setError(t("networkError"))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-2">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-[#232946] rounded-3xl shadow-2xl p-4 sm:p-8 flex flex-col gap-6 animate-fade-in"
      >
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-primary dark:text-tertiary mb-4 sm:mb-6">{t("login")}</h3>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-8 mb-4">
          <img
            className={`w-24 h-20 sm:w-40 sm:h-36 rounded-2xl cursor-pointer object-cover shadow-lg transition-all duration-300 ${role === "teacher" ? "ring-4 ring-primary scale-105" : "hover:scale-105"}`}
            src="/teacher.jpeg"
            alt={t("teacherImage") || "Teacher"}
            tabIndex={0}
            onClick={() => setRole("teacher")}
          />
          <img
            className={`w-24 h-20 sm:w-40 sm:h-36 rounded-2xl cursor-pointer object-cover shadow-lg transition-all duration-300 ${role === "student" ? "ring-4 ring-tertiary scale-105" : "hover:scale-105"}`}
            src="/children.jpg"
            alt={t("studentImage") || "Student"}
            tabIndex={0}
            onClick={() => setRole("student")}
          />
        </div>
        {role && (
          <>
            <input
              className="bg-gray-100 dark:bg-gray-700 w-full h-12 sm:h-14 rounded-2xl pl-4 focus:outline-none focus:ring-4 focus:ring-primary text-default dark:text-white transition-all placeholder-gray-500 dark:placeholder-gray-300"
              type={role === "teacher" ? "email" : "text"}
              placeholder={role === "teacher" ? t("email") : t("user")}
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              required
            />
            <input
              className="bg-gray-100 dark:bg-gray-700 w-full h-12 sm:h-14 rounded-2xl pl-4 focus:outline-none focus:ring-4 focus:ring-tertiary text-default dark:text-white transition-all placeholder-gray-500 dark:placeholder-gray-300"
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && (
              <div className="text-red-500 text-center mb-2">{error}</div>
            )}
            <button className="bg-gradient-to-r from-primary to-tertiary hover:from-tertiary hover:to-primary text-white font-bold py-3 rounded-2xl shadow-lg transition-all duration-300">
              {t("login")}
            </button>
          </>
        )}
      </form>
    </div>
  )
}
