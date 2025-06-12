import { useEffect, useState } from "react"
import { authFetch } from "../utils/authFetch"
import { socket } from "../utils/socket"

function Breadcrumb({ path, onNavigate }) {
  const parts = path.split("/").filter(Boolean)
  return (
    <nav className="mb-2 text-sm">
      <span className="cursor-pointer text-blue-600" onClick={() => onNavigate("")}>root</span>
      {parts.map((part, idx) => (
        <span key={idx}>
          {" / "}
          <span
            className="cursor-pointer text-blue-600"
            onClick={() => onNavigate(parts.slice(0, idx + 1).join("/"))}
          >
            {part}
          </span>
        </span>
      ))}
    </nav>
  )
}

const TEXT_EXTENSIONS = [".txt", ".js", ".ts", ".py", ".md", ".json", ".html", ".css", ".env", "php", ".java", ".c", ".cpp", ".go", ".rb"]

export default function FileBrowser() {
  const [tree, setTree] = useState([])
  const [currentPath, setCurrentPath] = useState("")
  const [currentChildren, setCurrentChildren] = useState([])
  const [fileContent, setFileContent] = useState("")
  const [selectedFile, setSelectedFile] = useState("")

  useEffect(() => {
    authFetch("/files/tree")
      .then(res => res && res.json())
      .then(data => {
        if (data.error) {
          setTree([])
          setFileContent(data.error)
        } else {
          setTree(data.tree || [])
        }
      })
  }, [])

  useEffect(() => {
    function findChildren(nodes, pathArr) {
      if (pathArr.length === 0) return nodes
      const [head, ...rest] = pathArr
      const node = nodes.find(n => n.name === head)
      if (!node) return []
      if (node.type === "directory") return findChildren(node.children, rest)
      return []
    }
    setCurrentChildren(findChildren(tree, currentPath.split("/").filter(Boolean)))
    setFileContent("")
    setSelectedFile("")
  }, [currentPath, tree])

  const handleFileClick = (file) => {
    const isText = TEXT_EXTENSIONS.some(ext => file.name.endsWith(ext))
    if (!isText) {
      setFileContent("Preview not available for this file type.")
      setSelectedFile(file.path)
      return
    }
    authFetch(`/files/content?path=${encodeURIComponent(file.path)}`)
      .then(res => res && res.json())
      .then(data => {
        setFileContent(data.content)
        setSelectedFile(file.path)
      })
  }

  useEffect(() => {
    if (!selectedFile) return
    const onFileChanged = (relPath) => {
      const normalizedRel = relPath.replace(/\\/g, "/")
      const normalizedSel = selectedFile.replace(/\\/g, "/")
      console.log("fileChanged event received:", normalizedRel, "selected:", normalizedSel)
      if (normalizedRel === normalizedSel) {
        authFetch(`/files/content?path=${encodeURIComponent(selectedFile)}`)
          .then(res => res && res.json())
          .then(data => setFileContent(data.content))
      }
    }
    socket.on("fileChanged", onFileChanged)
    return () => socket.off("fileChanged", onFileChanged)
  }, [selectedFile])

  return (
    <div className="w-1/3 bg-white/80 dark:bg-[#2d334a]/80 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl flex flex-col max-h-[70vh] min-h-[400px] shadow-2xl backdrop-blur-md animate-fade-in">
      <Breadcrumb path={currentPath} onNavigate={setCurrentPath} />
      <ul className="mb-4 flex-1 overflow-y-auto">
        {currentChildren.map(item =>
          item.type === "directory" ? (
            <li key={item.path} className="font-bold cursor-pointer text-blue-700 hover:underline transition-all" onClick={() => setCurrentPath(item.path)}>
              📁 {item.name}
            </li>
          ) : (
            <li key={item.path} className="cursor-pointer hover:bg-primary/20 rounded px-2 transition-all" onClick={() => handleFileClick(item)}>
              📄 {item.name}
            </li>
          )
        )}
      </ul>
      {selectedFile && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 overflow-auto shadow-inner" style={{ maxHeight: "30vh" }}>
          <div className="font-mono text-xs whitespace-pre-wrap text-gray-800 dark:text-gray-100">{fileContent}</div>
        </div>
      )}
    </div>
  )
}