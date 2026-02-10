import fs from "fs"
import path from "path"

const DB_PATH = path.join(process.cwd(), "db_dummy")
const PROJECTS_FILE = path.join(DB_PATH, "projects.json")

export interface Project {
  id: string
  name: string
  createdAt: string
}

export interface CreateProjectInput {
  name: string
}

function ensureDbExists() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH, { recursive: true })
  }
  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify([], null, 2))
  }
}

function readProjects(): Project[] {
  ensureDbExists()
  try {
    const data = fs.readFileSync(PROJECTS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

function writeProjects(projects: Project[]) {
  ensureDbExists()
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2))
}

function generateSlug(name: string): string {
  const random = Math.random().toString(36).substring(2, 8)
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  return `${slug}-${random}`
}

export function getProjects(): Project[] {
  return readProjects()
}

export function getProject(id: string): Project | undefined {
  const projects = readProjects()
  return projects.find((p) => p.id === id)
}

export function createProject(input: CreateProjectInput): Project {
  const projects = readProjects()
  const newProject: Project = {
    id: generateSlug(input.name),
    name: input.name.trim(),
    createdAt: new Date().toISOString(),
  }
  projects.unshift(newProject)
  writeProjects(projects)
  return newProject
}

export function updateProject(id: string, name: string): Project | null {
  const projects = readProjects()
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) return null
  projects[index] = { ...projects[index], name }
  writeProjects(projects)
  return projects[index]
}

export function deleteProject(id: string): boolean {
  const projects = readProjects()
  const filtered = projects.filter((p) => p.id !== id)
  if (filtered.length === projects.length) return false
  writeProjects(filtered)
  return true
}
