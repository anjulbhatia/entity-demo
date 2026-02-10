import fs from "fs"
import path from "path"

const DB_PATH = path.join(process.cwd(), "db_dummy")
const SKILLS_FILE = path.join(DB_PATH, "skills.json")
const SKILLS_CONTENT_DIR = path.join(DB_PATH, "skills-content")

export interface Skill {
  id: string
  name: string
  description: string
  category: string
  content?: string
  createdAt: string
}

export interface CreateSkillInput {
  name: string
  description: string
  category: string
  content?: string
}

function ensureDbExists() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH, { recursive: true })
  }
  if (!fs.existsSync(SKILLS_FILE)) {
    fs.writeFileSync(SKILLS_FILE, JSON.stringify([], null, 2))
  }
  if (!fs.existsSync(SKILLS_CONTENT_DIR)) {
    fs.mkdirSync(SKILLS_CONTENT_DIR, { recursive: true })
  }
}

function readSkillsIndex(): Skill[] {
  ensureDbExists()
  try {
    const data = fs.readFileSync(SKILLS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

function writeSkillsIndex(skills: Skill[]) {
  ensureDbExists()
  fs.writeFileSync(SKILLS_FILE, JSON.stringify(skills, null, 2))
}

function generateSlug(name: string): string {
  const random = Math.random().toString(36).substring(2, 8)
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  return `${slug}-${random}`
}

function getSkillContentPath(id: string): string {
  return path.join(SKILLS_CONTENT_DIR, `${id}.md`)
}

export function getSkills(): Skill[] {
  const skills = readSkillsIndex()
  return skills.map(({ content, ...rest }) => rest)
}

export function getSkill(id: string): Skill | undefined {
  const skills = readSkillsIndex()
  const skill = skills.find((s) => s.id === id)
  if (!skill) return undefined
  
  let content: string | undefined
  try {
    const contentPath = getSkillContentPath(id)
    if (fs.existsSync(contentPath)) {
      content = fs.readFileSync(contentPath, "utf-8")
    }
  } catch {
    content = undefined
  }
  
  return { ...skill, content }
}

export function createSkill(input: CreateSkillInput): Skill {
  const skills = readSkillsIndex()
  const id = generateSlug(input.name)
  
  const newSkill: Skill = {
    id,
    name: input.name.trim(),
    description: input.description.trim(),
    category: input.category,
    createdAt: new Date().toISOString(),
  }
  
  if (input.content) {
    const contentPath = getSkillContentPath(id)
    fs.writeFileSync(contentPath, input.content)
  }
  
  skills.unshift(newSkill)
  writeSkillsIndex(skills)
  return newSkill
}

export function updateSkillContent(id: string, content: string): Skill | null {
  const skills = readSkillsIndex()
  const index = skills.findIndex((s) => s.id === id)
  if (index === -1) return null
  
  const contentPath = getSkillContentPath(id)
  fs.writeFileSync(contentPath, content)
  
  return skills[index]
}

export function deleteSkill(id: string): boolean {
  const skills = readSkillsIndex()
  const filtered = skills.filter((s) => s.id !== id)
  if (filtered.length === skills.length) return false
  
  try {
    const contentPath = getSkillContentPath(id)
    if (fs.existsSync(contentPath)) {
      fs.unlinkSync(contentPath)
    }
  } catch {
    // Content file might not exist
  }
  
  writeSkillsIndex(filtered)
  return true
}
