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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/60 to-tertiary/60">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] bg-white/80 dark:bg-[#232946]/90 rounded-3xl shadow-2xl p-10 flex flex-col gap-6 animate-fade-in backdrop-blur-md"
      >
        <h3 className="text-3xl font-bold text-center text-primary dark:text-tertiary mb-6">{t("login")}</h3>
        <div className="flex justify-between">
          <img
            className={`w-52 h-44 rounded-2xl cursor-pointer ${role === "teacher" ? "ring-4 ring-blue-500" : ""}`}
            src="/teacher.jpeg"
            alt="image teacher"
            tabIndex={0}
            onClick={() => handleRoleSelect("teacher")}
          />
          <img
            className={`w-52 h-44 rounded-2xl cursor-pointer ${role === "student" ? "ring-4 ring-green-500" : ""}`}
            src="/children.jpg"
            alt="image child"
            tabIndex={0}
            onClick={() => handleRoleSelect("student")}
          />
        </div>
        {role && (
          <>
            <input
              className="bg-white w-full h-14 rounded-2xl pl-4 focus:outline-none focus:ring-4 focus:ring-secundary text-default"
              type={role === "teacher" ? "email" : "text"}
              placeholder={role === "teacher" ? t("email") : t("user")}
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              required
            />
            <input
              className="bg-white w-full h-14 rounded-2xl pl-4 focus:outline-none focus:ring-4 focus:ring-secundary text-default"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && (
              <div className="text-red-500 text-center mb-2">{error}</div>
            )}
            <input className="bg-secundary w-full h-14 rounded-2xl text-white cursor-pointer" type="submit" value={t("login")} />
          </>
        )}
      </form>
    </div>
  )
}
