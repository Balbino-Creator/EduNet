import { useState, useEffect } from "react"
import Modal from "../components/Modal"

// Centralized authenticated fetch
async function authFetch(url, options = {}) {
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

export default function Home() {
  const [userData, setUserData] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [projectForm, setProjectForm] = useState({ name: "" })
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [studentForm, setStudentForm] = useState({
    name: "",
    last_names: "",
    password: "",
    classroomId: ""
  })
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [studentError, setStudentError] = useState("")
  const [classrooms, setClassrooms] = useState<any[]>([])
  const [classroomForm, setClassroomForm] = useState({ name: "", projectId: "" })
  const [selectedClassroom, setSelectedClassroom] = useState<any>(null)
  const [error, setError] = useState("")
  const [modal, setModal] = useState<null | string>(null)

  useEffect(() => {
    authFetch("http://localhost:4000/api/me")
      .then(res => res && res.json())
      .then(data => {
        if (data && data.error) setError(data.error)
        else if (data) setUserData(data.data)
      })
      .catch(() => setError("Failed to load user data"))

    authFetch("http://localhost:4000/api/projects")
      .then(res => res && res.json())
      .then(data => setProjects((data && data.data) || []))
      .catch(() => setError("Failed to load projects"))

    authFetch("http://localhost:4000/api/students")
      .then(res => res && res.json())
      .then(data => setStudents((data && data.data) || []))
      .catch(() => setError("Failed to load students"))

    authFetch("http://localhost:4000/api/classrooms")
      .then(res => res && res.json())
      .then(data => setClassrooms((data && data.data) || []))
      .catch(() => setError("Failed to load classrooms"))
  }, [])

  const handleCreateProject = async (e) => {
    e.preventDefault()
    const res = await authFetch("http://localhost:4000/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: projectForm.name })
    })
    if (res && res.ok) {
      const data = await res.json()
      setProjects([...projects, data.data])
      setModal(null)
      setProjectForm({ name: "" })
    }
  }
  const handleDeleteProject = async (id) => {
    const res = await authFetch(`http://localhost:4000/api/projects/${id}`, {
      method: "DELETE"
    })
    if (res && res.ok) setProjects(projects.filter(p => p.id !== id))
  }
  const handleEditProject = async (e) => {
    e.preventDefault()
    const res = await authFetch(`http://localhost:4000/api/projects/${selectedProject.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: projectForm.name })
    })
    if (res && res.ok) {
      const data = await res.json()
      setProjects(projects.map(p => p.id === data.data.id ? data.data : p))
      setModal(null)
      setSelectedProject(null)
      setProjectForm({ name: "" })
    }
  }

  const handleCreateStudent = async (e) => {
    e.preventDefault()
    setStudentError("")
    const res = await authFetch("http://localhost:4000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: studentForm.name,
        uid: studentForm.name,
        last_names: studentForm.last_names,
        password: studentForm.password,
        role: "student",
        classroomId: Number(studentForm.classroomId)
      })
    })
    const data = res && await res.json()
    if (res && res.ok) {
      setStudents([...students, data.data])
      setModal(null)
      setStudentForm({ name: "", last_names: "", password: "", classroomId: "" })
    } else {
      setStudentError((data && data.error) || "The student could not be created")
    }
  }
  const handleDeleteStudent = async (id) => {
    const res = await authFetch(`http://localhost:4000/api/users/${id}`, {
      method: "DELETE"
    })
    if (res && res.ok) {
      const studentsRes = await authFetch("http://localhost:4000/api/students")
      const data = studentsRes && await studentsRes.json()
      setStudents((data && data.data) || [])
    }
  }
  const handleEditStudent = async (e) => {
    e.preventDefault()
    setStudentError("")
    const body = {
      name: studentForm.name,
      uid: studentForm.name,
      last_names: studentForm.last_names,
      role: "student",
      classroomId: Number(studentForm.classroomId)
    }
    if (studentForm.password) body.password = studentForm.password

    const res = await authFetch(`http://localhost:4000/api/users/${selectedStudent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
    const data = res && await res.json()
    if (res && res.ok) {
      setStudents(students.map(s => s.id === data.data.id ? data.data : s))
      setModal(null)
      setSelectedStudent(null)
      setStudentForm({ name: "", last_names: "", password: "", classroomId: "" })
    } else {
      setStudentError((data && data.error) || "The student could not be edited")
    }
  }

  const handleCreateClassroom = async (e) => {
    e.preventDefault()
    const res = await authFetch("http://localhost:4000/api/classrooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: classroomForm.name, projectId: Number(classroomForm.projectId) })
    })
    if (res && res.ok) {
      const data = await res.json()
      setClassrooms([...classrooms, data.data])
      setModal(null)
      setClassroomForm({ name: "", projectId: "" })
    }
  }
  const handleDeleteClassroom = async (id) => {
    const res = await authFetch(`http://localhost:4000/api/classrooms/${id}`, {
      method: "DELETE"
    })
    if (res && res.ok) setClassrooms(classrooms.filter(c => c.id !== id))
  }
  const handleEditClassroom = async (e) => {
    e.preventDefault()
    const res = await authFetch(`http://localhost:4000/api/classrooms/${selectedClassroom.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: classroomForm.name })
    })
    if (res && res.ok) {
      const data = await res.json()
      setClassrooms(classrooms.map(c => c.id === data.data.id ? data.data : c))
      setModal(null)
      setSelectedClassroom(null)
      setClassroomForm({ name: "" })
    }
  }

  if (error) return <p className="text-red-500">{error}</p>
  if (!userData) return <p>Loading data...</p>

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  return (
    <div className="flex flex-col h-full">
      <section>
        <h3 className="page-title text-default">Home</h3>
        <div className="flex justify-end items-center gap-3.5">
          <img src={userData.profileImage || "/teacher.jpeg"} alt="foto perfil" className="w-12 h-12 rounded-full object-cover text-default"/>
          <p className="text-default">{userData.name}</p>
        </div>
        <h1 className="text-4xl mb-12 text-default">Hello, {userData.name}!</h1>
      </section>
      <div className="grid grid-cols-4 gap-6 h-full flex-1">
        <div className="col-span-3 grid grid-cols-3 gap-6">
          <button className="bg-secundary text-white rounded-2xl text-3xl font-bold" onClick={() => setModal("createProject")}>ADD PROJECT</button>
          <button className="bg-secundary text-white rounded-2xl text-3xl font-bold" onClick={() => setModal("editProject")}>EDIT PROJECT</button>
          <button className="bg-secundary text-white rounded-2xl text-3xl font-bold" onClick={() => setModal("deleteProject")}>REMOVE PROJECT</button>
          <button className="bg-secundary text-white rounded-2xl text-3xl font-bold" onClick={() => setModal("createStudent")}>ADD STUDENT</button>
          <button className="bg-secundary text-white rounded-2xl text-3xl font-bold" onClick={() => setModal("editStudent")}>EDIT STUDENT</button>
          <button className="bg-secundary text-white rounded-2xl text-3xl font-bold" onClick={() => setModal("deleteStudent")}>REMOVE STUDENT</button>
          <button className="bg-secundary text-white rounded-2xl text-3xl font-bold" onClick={() => setModal("createClassroom")}>ADD CLASSROOM</button>
          <button className="bg-secundary text-white rounded-2xl text-3xl font-bold" onClick={() => setModal("editClassroom")}>EDIT CLASSROOM</button>
          <button className="bg-secundary text-white rounded-2xl text-3xl font-bold" onClick={() => setModal("deleteClassroom")}>REMOVE CLASSROOM</button>
        </div>
        <button
          className="bg-tertiary text-white rounded-2xl text-3xl font-bold"
          onClick={handleLogout}
        >
          LOG OUT
        </button>
      </div>

      <Modal open={modal === "createProject"} onClose={() => setModal(null)}>
        <h2 className="text-xl font-bold mb-4">Create Project</h2>
        <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Project Name"
            value={projectForm.name}
            onChange={e => setProjectForm({ name: e.target.value })}
            required
          />
          <button className="bg-primary text-white px-4 py-2 rounded" type="submit">Create</button>
        </form>
      </Modal>
      <Modal open={modal === "deleteProject"} onClose={() => setModal(null)}>
        <h2 className="text-xl font-bold mb-4">Delete Project</h2>
        <ul className="space-y-2">
          {projects.map(p => (
            <li key={p.id} className="flex justify-between items-center">
              <span>{p.name}</span>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDeleteProject(p.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </Modal>
      <Modal open={modal === "editProject"} onClose={() => { setModal(null); setSelectedProject(null); setProjectForm({ name: "" }) }}>
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        {!selectedProject ? (
          <ul className="space-y-2">
            {projects.map(p => (
              <li key={p.id} className="flex justify-between items-center">
                <span>{p.name}</span>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => { setSelectedProject(p); setProjectForm({ name: p.name }) }}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <form onSubmit={handleEditProject} className="flex flex-col gap-4">
            <input
              className="border rounded px-3 py-2"
              placeholder="New Name"
              value={projectForm.name}
              onChange={e => setProjectForm({ name: e.target.value })}
              required
            />
            <button className="bg-primary text-white px-4 py-2 rounded" type="submit">Save</button>
          </form>
        )}
      </Modal>

      <Modal open={modal === "createStudent"} onClose={() => setModal(null)}>
        <h2 className="text-xl font-bold mb-4">Create Student</h2>
        <form onSubmit={handleCreateStudent} className="flex flex-col gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Username"
            value={studentForm.name}
            onChange={e => setStudentForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Last Name"
            value={studentForm.last_names}
            onChange={e => setStudentForm(f => ({ ...f, last_names: e.target.value }))}
            required
          />
          <input
            className="border rounded px-3 py-2"
            type="password"
            placeholder="Password"
            value={studentForm.password}
            onChange={e => setStudentForm(f => ({ ...f, password: e.target.value }))}
            required
          />
          <select
            className="border rounded px-3 py-2"
            value={studentForm.classroomId}
            onChange={e => setStudentForm(f => ({ ...f, classroomId: e.target.value }))}
            required
          >
            <option value="">Select a classroom</option>
            {classrooms.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {studentError && <div className="text-red-500">{studentError}</div>}
          <button className="bg-primary text-white px-4 py-2 rounded" type="submit">Create</button>
        </form>
      </Modal>
      <Modal open={modal === "deleteStudent"} onClose={() => setModal(null)}>
        <h2 className="text-xl font-bold mb-4">Delete Student</h2>
        <ul className="space-y-2">
          {students.map(s => (
            <li key={s.id} className="flex justify-between items-center">
              <span>{s.name}</span>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDeleteStudent(s.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </Modal>
      <Modal open={modal === "editStudent"} onClose={() => { setModal(null); setSelectedStudent(null); setStudentForm({ name: "", last_names: "", password: "", classroomId: "" }) }}>
        <h2 className="text-xl font-bold mb-4">Edit Student</h2>
        {!selectedStudent ? (
          <ul className="space-y-2">
            {students.map(s => (
              <li key={s.id} className="flex justify-between items-center">
                <span>{s.name}</span>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => {
                    setSelectedStudent(s)
                    setStudentForm({
                      name: s.name,
                      last_names: s.last_names,
                      password: "",
                      classroomId: s.classroomId ? String(s.classroomId) : ""
                    })
                  }}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <form onSubmit={handleEditStudent} className="flex flex-col gap-4">
            <input
              className="border rounded px-3 py-2"
              placeholder="Username"
              value={studentForm.name}
              onChange={e => setStudentForm(f => ({ ...f, name: e.target.value }))}
              required
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Last Name"
              value={studentForm.last_names}
              onChange={e => setStudentForm(f => ({ ...f, last_names: e.target.value }))}
              required
            />
            <input
              className="border rounded px-3 py-2"
              type="password"
              placeholder="New Password (optional)"
              value={studentForm.password}
              onChange={e => setStudentForm(f => ({ ...f, password: e.target.value }))}
            />
            <select
              className="border rounded px-3 py-2"
              value={studentForm.classroomId}
              onChange={e => setStudentForm(f => ({ ...f, classroomId: e.target.value }))}
              required
            >
              <option value="">Select a classroom</option>
              {classrooms.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {studentError && <div className="text-red-500">{studentError}</div>}
            <button className="bg-primary text-white px-4 py-2 rounded" type="submit">Save</button>
          </form>
        )}
      </Modal>

      <Modal open={modal === "createClassroom"} onClose={() => setModal(null)}>
        <h2 className="text-xl font-bold mb-4">Create Classroom</h2>
        <form onSubmit={handleCreateClassroom} className="flex flex-col gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Classroom Name"
            value={classroomForm.name}
            onChange={e => setClassroomForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <select
            className="border rounded px-3 py-2"
            value={classroomForm.projectId}
            onChange={e => setClassroomForm(f => ({ ...f, projectId: e.target.value }))}
            required
          >
            <option value="">Select a project</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button className="bg-primary text-white px-4 py-2 rounded" type="submit">Create</button>
        </form>
      </Modal>
      <Modal open={modal === "deleteClassroom"} onClose={() => setModal(null)}>
        <h2 className="text-xl font-bold mb-4">Delete Classroom</h2>
        <ul className="space-y-2">
          {classrooms.map(c => (
            <li key={c.id} className="flex justify-between items-center">
              <span>{c.name}</span>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDeleteClassroom(c.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </Modal>
      <Modal open={modal === "editClassroom"} onClose={() => { setModal(null); setSelectedClassroom(null); setClassroomForm({ name: "" }) }}>
        <h2 className="text-xl font-bold mb-4">Edit Classroom</h2>
        {!selectedClassroom ? (
          <ul className="space-y-2">
            {classrooms.map(c => (
              <li key={c.id} className="flex justify-between items-center">
                <span>{c.name}</span>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => { setSelectedClassroom(c); setClassroomForm({ name: c.name }) }}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <form onSubmit={handleEditClassroom} className="flex flex-col gap-4">
            <input
              className="border rounded px-3 py-2"
              placeholder="New name"
              value={classroomForm.name}
              onChange={e => setClassroomForm({ name: e.target.value })}
              required
            />
            <button className="bg-primary text-white px-4 py-2 rounded" type="submit">Save</button>
          </form>
        )}
      </Modal>
    </div>
  )
}

