import { createContext, useContext, useState, useEffect } from "react"

const translations = {
  Español: {
    home: "Inicio",
    hello: "¡Hola",
    addProject: "Añadir proyecto",
    editProject: "Editar proyecto",
    removeProject: "Eliminar proyecto",
    addStudent: "Añadir estudiante",
    editStudent: "Editar estudiante",
    removeStudent: "Eliminar estudiante",
    addClassroom: "Añadir clase",
    editClassroom: "Editar clase",
    removeClassroom: "Eliminar clase",
    logout: "Cerrar sesión",
    createProject: "Crear proyecto",
    projectName: "Nombre del proyecto",
    create: "Crear",
    loadingData: "Cargando datos...",
    accountConfirmed: "¡Cuenta confirmada con éxito!",
    canLoginNow: "Ya puedes iniciar sesión con tus credenciales.",
    settings: "Ajustes",
    darkMode: "Modo oscuro",
    activate: "Activar",
    deactivate: "Desactivar",
    language: "Idioma",
    account: "Cuenta",
    loading: "Cargando ajustes...",
    email: "Correo electrónico",
    user: "Usuario",
    password: "Contraseña",
    save: "Guardar",
    edit: "Editar",
    delete: "Eliminar",
    selectClassroom: "Selecciona una clase",
    selectProject: "Selecciona un proyecto",
    newName: "Nuevo nombre",
    classroomName: "Nombre de la clase",
    lastName: "Apellidos",
    // Menú
    login: "Iniciar sesión",
    registerTeacher: "Registrar profesor",
    projects: "Proyectos",
    liveCode: "Código en vivo",
    // Modales
    createStudent: "Crear estudiante",
    editStudent: "Editar estudiante",
    deleteStudent: "Eliminar estudiante",
    createClassroom: "Crear clase",
    editClassroom: "Editar clase",
    deleteClassroom: "Eliminar clase",
    invalidCredentials: "Usuario o contraseña incorrectos.",
    ldapFailed: "Autenticación LDAP fallida. Revisa tus credenciales.",
    networkError: "Error de red, inténtalo de nuevo más tarde.",
    // Mensajes de escritorio
    desktopOnlyTitle: "Solo disponible en escritorio",
    desktopOnlyMessage: "Esta página solo está disponible en pantallas grandes. Por favor, accede desde un ordenador.",
  },
  English: {
    home: "Home",
    hello: "Hello",
    addProject: "ADD PROJECT",
    editProject: "EDIT PROJECT",
    removeProject: "REMOVE PROJECT",
    addStudent: "ADD STUDENT",
    editStudent: "EDIT STUDENT",
    removeStudent: "REMOVE STUDENT",
    addClassroom: "ADD CLASSROOM",
    editClassroom: "EDIT CLASSROOM",
    removeClassroom: "REMOVE CLASSROOM",
    logout: "LOG OUT",
    createProject: "Create Project",
    projectName: "Project Name",
    create: "Create",
    loadingData: "Loading data...",
    accountConfirmed: "Account confirmed successfully!",
    canLoginNow: "You can now log in with your credentials.",
    settings: "Settings",
    darkMode: "Dark mode",
    activate: "Activate",
    deactivate: "Deactivate",
    language: "Language",
    account: "Account",
    loading: "Loading settings...",
    email: "Email",
    user: "User",
    password: "Password",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    selectClassroom: "Select a classroom",
    selectProject: "Select a project",
    newName: "New name",
    classroomName: "Classroom Name",
    lastName: "Last Name",
    // Menu
    login: "Login",
    registerTeacher: "Register as Teacher",
    projects: "Projects",
    liveCode: "Live Code",
    // Modals
    createStudent: "Create Student",
    editStudent: "Edit Student",
    deleteStudent: "Delete Student",
    createClassroom: "Create Classroom",
    editClassroom: "Edit Classroom",
    deleteClassroom: "Delete Classroom",
    invalidCredentials: "Invalid username or password.",
    ldapFailed: "LDAP authentication failed. Check your credentials.",
    networkError: "Network error, please try again later.",
    // Desktop messages
    desktopOnlyTitle: "Desktop only",
    desktopOnlyMessage: "This page is only available on large screens. Please access from a desktop device."
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"
  })
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "Español"
  })

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode)
    localStorage.setItem("darkMode", String(darkMode))
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const t = (key) => translations[language][key] || key

  return (
    <AppContext.Provider value={{ darkMode, setDarkMode, language, setLanguage, t }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}