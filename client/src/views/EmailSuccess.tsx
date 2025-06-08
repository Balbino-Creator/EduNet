import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../contexts/AppContext"

export default function EmailSuccess() {
  const { t } = useAppContext()
  const navigate = useNavigate()
  useEffect(() => {
    const timer = setTimeout(() => navigate("/"), 4000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-bold text-green-600 mb-4">{t("accountConfirmed")}</h2>
      <p className="text-lg text-default">{t("canLoginNow")}</p>
    </div>
  )
}