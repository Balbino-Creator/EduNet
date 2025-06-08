import { useState, useEffect } from "react"
import { authFetch } from "../utils/authFetch"
import { useAppContext } from "../contexts/AppContext"

export default function Settings() {
  const [userData, setUserData] = useState<any>(null)
  const [error, setError] = useState("")
  const { darkMode, setDarkMode, language, setLanguage, t } = useAppContext()

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
    <div className="flex flex-col space-y-6 text-default">
      <h3 className="page-title text-default">{t("settings")}</h3>
      <div className="rounded-2xl space-y-4">
        {/* Dark mode */}
        <div className="flex justify-between items-center">
          <span className="font-medium">{t("darkMode")}</span>
          <button>{darkMode ? t("deactivate") : t("activate")}</button>
        </div>

        {/* Language */}
        <div className="flex justify-between items-center">
          <span className="font-medium">{t("language")}</span>
          <select
            className="px-3 py-2 rounded-md border bg-gray-500 text-white focus:border-secbg-secundary focus:ring-secbg-secundary"
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
          <input
            type="email"
            value={userData.email || ""}
            className="w-full px-4 py-3 rounded-md border text-white bg-gray-500 outline-none focus:border-tertiary focus:ring-tertiary focus:ring-4"
            readOnly
          />
        </div>
      </div>
    </div>
  )
}
