const API_URL = import.meta.env.VITE_API_URL || "https://www.edunet.org.es/api";

export async function authFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const url = path.startsWith("http") ? path : `${API_URL}${path.startsWith("/") ? path : "/" + path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    }
  });
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/";
    return null;
  }
  return res;
}