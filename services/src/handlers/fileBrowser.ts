import { Request, Response } from "express"
import fs from "fs"
import path from "path"
import { restartWatcher } from "../index"

export let sharedDir = process.env.SHARED_DIR || path.resolve(__dirname, "../../../shared")

export const setSharedDir = (req: Request, res: Response) => {
  const { dir } = req.body
  if (!dir || !fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    res.status(400).json({ error: "Invalid directory" })
    return
  }
  sharedDir = dir
  res.json({ message: "Shared directory updated", dir })
}

export const setSharedDirAndRestartWatcher = (req: Request, res: Response) => {
  setSharedDir(req, res)
  if (typeof restartWatcher === "function") {
    restartWatcher()
  }
}

export const getDirectoryTree = (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(sharedDir) || !fs.statSync(sharedDir).isDirectory()) {
      res.status(400).json({ error: "No directory shared yet." })
      return
    }
    function getDirTree(dirPath: string, relPath = ""): any {
      const fullPath = path.join(dirPath, relPath)
      const items = fs.readdirSync(fullPath, { withFileTypes: true })
      return items.map(item => {
        const itemPath = path.join(relPath, item.name)
        if (item.isDirectory()) {
          return {
            type: "directory",
            name: item.name,
            path: itemPath,
            children: getDirTree(dirPath, itemPath)
          }
        } else {
          return {
            type: "file",
            name: item.name,
            path: itemPath
          }
        }
      })
    }
    const tree = getDirTree(sharedDir)
    res.json({ tree })
  } catch (error) {
    res.status(500).json({ error: "Failed to read directory" })
  }
}

export const getFileContent = (req: Request, res: Response) => {
  try {
    const relPath = req.query.path as string
    if (!relPath) {
      res.status(400).json({ error: "No file path provided" })
      return
    }
    const filePath = path.join(sharedDir, relPath)
    if (!filePath.startsWith(sharedDir)) {
      res.status(403).json({ error: "Forbidden" })
      return
    }
    const content = fs.readFileSync(filePath, "utf-8")
    res.json({ content })
  } catch (error) {
    res.status(500).json({ error: "Failed to read file" })
  }
}