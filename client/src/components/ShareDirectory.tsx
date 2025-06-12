import { useState } from "react"
import { authFetch } from "../utils/authFetch"

export default function ShareDirectory({ onShared }) {
  const [dir, setDir] = useState("")

  const handleShare = async (e) => {
    e.preventDefault()
    if (!dir) return
    const res = await authFetch("/files/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dir })
    })
    if (res && res.ok) onShared()
  }

  return (
    <form onSubmit={handleShare} className="mb-4">
      <label className="block mb-2 font-bold">Absolute path to share:</label>
      <input
        type="text"
        value={dir}
        onChange={e => setDir(e.target.value)}
        placeholder="C:\Users\balbi\Desktop\YOUR_PROJECT"
        className="border rounded px-3 py-2 w-full mb-2"
      />
      <button className="bg-primary text-white px-4 py-2 rounded" type="submit">Share</button>
    </form>
  )
}