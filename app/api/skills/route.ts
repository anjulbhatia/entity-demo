import { NextRequest, NextResponse } from "next/server"
import { getSkills, createSkill, updateSkillContent, deleteSkill, getSkill } from "@/lib/db/skills"

export async function GET() {
  const skills = getSkills()
  return NextResponse.json(skills)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }
    const skill = createSkill({
      name: body.name,
      description: body.description || "",
      category: body.category || "analytics",
      content: body.content,
    })
    return NextResponse.json(skill, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.id || !body.content) {
      return NextResponse.json({ error: "ID and content are required" }, { status: 400 })
    }
    const skill = updateSkillContent(body.id, body.content)
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 })
    }
    return NextResponse.json(skill)
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }
    const success = deleteSkill(id)
    if (!success) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
