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
        setError(data.error || "Login failed")
        return
      }
      localStorage.setItem("token", data.token)
      window.location.href = "/home"
    } catch (err) {
      setError("Network error, please try again later.")
    }
  }

  return (
    <>
      <h3 className="page-title text-default">{t("login")}</h3>
      <section className="w-full h-full flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-[600px] h-[600px] bg-tertiary rounded-2xl p-12 flex flex-col justify-between">
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
              <input className="bg-secundary w-full h-14 rounded-2xl text-white cursor-pointer" type="submit" value="Entrar" />
            </>
          )}
        </form>
      </section>
    </>
  )
}
