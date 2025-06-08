export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token")
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    }
  })
  if (res.status === 401) {
    localStorage.removeItem("token")
    window.location.href = "/"
    return null
  }
  return res
}