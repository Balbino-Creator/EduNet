import { useState, useEffect } from "react"
import { authFetch } from "../utils/authFetch"
import { useAppContext } from "../contexts/AppContext"

export default function Settings() {
  const { darkMode, setDarkMode, language, setLanguage, t } = useAppContext()
  const [userData, setUserData] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    authFetch("http://localhost:4000/api/me")
      .then(response => response && response.json())
      .then(data => {
        if (data && data.error) setError(data.error)
        else setUserData(data.data)
      })
      .catch(() => setError("Failed to load user data"))
  }, [])

  if (error) return <p className="text-red-500">{error}</p>
  if (!userData) return <p>{t("loading")}</p>

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
      <div className="w-full max-w-xl bg-white/80 dark:bg-[#2d334a]/80 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl p-10 flex flex-col gap-8 backdrop-blur-md">
        <h3 className="text-3xl font-bold text-center text-primary dark:text-tertiary mb-6">{t("settings")}</h3>
        {/* Dark mode */}
        <div className="flex justify-between items-center">
          <span className="font-medium">{t("darkMode")}</span>
          <button
            className={`w-16 h-8 flex items-center rounded-full p-1 duration-300 ease-in-out ${darkMode ? "bg-primary" : "bg-gray-300"}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            <span className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${darkMode ? "translate-x-8" : ""}`}></span>
          </button>
        </div>

        {/* Language */}
        <div className="flex justify-between items-center">
          <span className="font-medium">{t("language")}</span>
          <select
            className="px-3 py-2 rounded-md border bg-gray-500 text-white focus:border-primary focus:ring-primary"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option value="Español">Español</option>
            <option value="English">English</option>
          </select>
        </div>

        {/* Account */}
        <div className="space-y-4">
          <span className="font-medium">{t("account")}</span>
          <input
            type="text"
            value={userData.name}
            className="w-full px-4 py-3 rounded-md border text-white bg-gray-500 outline-none focus:border-tertiary focus:ring-tertiary focus:ring-4"
            readOnly
          />
          {userData.role === "teacher" && (
            <input
              type="email"
              value={userData.email || ""}
              className="w-full px-4 py-3 rounded-md border text-white bg-gray-500 outline-none focus:border-tertiary focus:ring-tertiary focus:ring-4"
              readOnly
            />
          )}
        </div>
      </div>
    </div>
  )
}
