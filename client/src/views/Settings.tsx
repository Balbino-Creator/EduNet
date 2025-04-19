import { useState, useEffect } from "react"

export default function Settings() {
  const [settingsData, setSettingsData] = useState(null)

  useEffect(() => {
    fetch("./src/ejemplos.json")
      .then(response => response.json())
      .then(json => setSettingsData(json.settings))
  }, [])

  if (!settingsData) return <p>Cargando configuración...</p>

  return (
    <div className="flex flex-col space-y-6 text-default">
      <h3 className="page-title text-default">Settings</h3>

      <div className="rounded-2xl space-y-4">
        {/* Modo oscuro */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Modo oscuro</span>
          <button className="px-3 py-2 rounded-full bg-secundary text-white font-semibold hover:bg-opacity-90">
            {settingsData.darkMode ? "Desactivar" : "Activar"}
          </button>
        </div>

        {/* Idioma */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Idioma</span>
          <select className="px-3 py-2 rounded-md border bg-gray-500 text-white focus:border-secbg-secundary focus:ring-secbg-secundary">
            {settingsData.languageOptions.map((lang, index) => (
              <option key={index}>{lang}</option>
            ))}
          </select>
        </div>

        {/* Accesibilidad */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Accesibilidad</span>
          <label className="flex items-center">
            <input type="checkbox" className="hidden peer" checked={settingsData.accessibility} />
            <div className="w-11 h-6 bg-gray-500 rounded-full peer-checked:bg-secundary relative cursor-pointer">
              <div className="absolute w-5 h-5 bg-white rounded-full left-0.5 top-0.5 transition"></div>
            </div>
          </label>
        </div>

        {/* Cuenta */}
        <div className="space-y-4">
          <span className="font-medium">Cuenta</span>
          <input
            type="text"
            value={settingsData.account.username}
            className="w-full px-4 py-3 rounded-md border text-white bg-gray-500 outline-none focus:border-tertiary focus:ring-tertiary focus:ring-4"
            readOnly
          />
          <input
            type="email"
            value={settingsData.account.email}
            className="w-full px-4 py-3 rounded-md border text-white bg-gray-500 outline-none focus:border-tertiary focus:ring-tertiary focus:ring-4"
            readOnly
          />
        </div>

        {/* Seguridad */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Autenticación en dos pasos</span>
          <label className="flex items-center">
            <input type="checkbox" className="hidden peer" checked={settingsData.security.twoFactorAuthentication} />
            <div className="w-11 h-6 bg-gray-500 rounded-full peer-checked:bg-secundary relative cursor-pointer">
              <div className="absolute w-5 h-5 bg-white rounded-full left-0.5 top-0.5 transition"></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
