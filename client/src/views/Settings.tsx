import { useState, useEffect } from "react"

export default function Settings() {
  const [userData, setUserData] = useState<any>(null)
  const [settingsData, setSettingsData] = useState({
    darkMode: false,
    languageOptions: ["Español", "English"],
    accessibility: false,
    security: { twoFactorAuthentication: false }
  })
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch("http://localhost:4000/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setUserData(data.data)
      })
      .catch(() => setError("Failed to load user data"))
  }, [])

  if (error) return <p className="text-red-500">{error}</p>
  if (!userData) return <p>Loading settings...</p>

  return (
    <div className="flex flex-col space-y-6 text-default">
      <h3 className="page-title text-default">Settings</h3>
      <div className="rounded-2xl space-y-4">
        {/* Dark mode */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Dark mode</span>
          <button className="px-3 py-2 rounded-full bg-secundary text-white font-semibold hover:bg-opacity-90">
            {settingsData.darkMode ? "Deactivate" : "Activate"}
          </button>
        </div>

        {/* Language */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Language</span>
          <select className="px-3 py-2 rounded-md border bg-gray-500 text-white focus:border-secbg-secundary focus:ring-secbg-secundary">
            {settingsData.languageOptions.map((lang, index) => (
              <option key={index}>{lang}</option>
            ))}
          </select>
        </div>

        {/* Accessibility */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Accessibility</span>
          <label className="flex items-center">
            <input type="checkbox" className="hidden peer" checked={settingsData.accessibility} readOnly />
            <div className="w-11 h-6 bg-gray-500 rounded-full peer-checked:bg-secundary relative cursor-pointer">
              <div className="absolute w-5 h-5 bg-white rounded-full left-0.5 top-0.5 transition"></div>
            </div>
          </label>
        </div>

        {/* Account */}
        <div className="space-y-4">
          <span className="font-medium">Account</span>
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

        {/* Security */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Two-factor authentication</span>
          <label className="flex items-center">
            <input type="checkbox" className="hidden peer" checked={settingsData.security.twoFactorAuthentication} readOnly />
            <div className="w-11 h-6 bg-gray-500 rounded-full peer-checked:bg-secundary relative cursor-pointer">
              <div className="absolute w-5 h-5 bg-white rounded-full left-0.5 top-0.5 transition"></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
