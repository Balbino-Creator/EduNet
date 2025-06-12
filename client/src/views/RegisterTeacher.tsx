import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function RegisterTeacher() {
  const [name, setName] = useState("")
  const [lastNames, setLastNames] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (password !== passwordConfirmation) {
      setError("Passwords do not match")
      return
    }
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          last_names: lastNames,
          role: "teacher",
          email,
          password,
          password_confirmation: passwordConfirmation
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Registration failed")
        return
      }
      setSuccess("Registration successful. You can now log in.")
      setTimeout(() => navigate("/"), 2000)
    } catch (err) {
      setError("Network error, please try again.")
    }
  }

  return (
    <section className="w-full h-full flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-[600px] bg-tertiary rounded-2xl p-12 flex flex-col gap-4">
        <h3 className="text-2xl font-bold mb-4 text-default">Teacher Registration</h3>
        <input
          className="bg-white h-12 rounded-2xl pl-4"
          type="text"
          placeholder="First Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className="bg-white h-12 rounded-2xl pl-4"
          type="text"
          placeholder="Last Name(s)"
          value={lastNames}
          onChange={e => setLastNames(e.target.value)}
          required
        />
        <input
          className="bg-white h-12 rounded-2xl pl-4"
          type="email"
          placeholder="Institutional Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="bg-white h-12 rounded-2xl pl-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          className="bg-white h-12 rounded-2xl pl-4"
          type="password"
          placeholder="Confirm Password"
          value={passwordConfirmation}
          onChange={e => setPasswordConfirmation(e.target.value)}
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <div className="flex gap-2">
          <input className="bg-secundary w-full h-12 rounded-2xl text-white cursor-pointer" type="submit" value="Register" />
          <button
            type="button"
            className="bg-gray-300 w-full h-12 rounded-2xl text-default"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}