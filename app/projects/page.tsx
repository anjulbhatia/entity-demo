"use client"

import * as React from "react"
import {
  Plus,
  MoreHorizontal,
  ExternalLink,
  Pencil,
  Trash2,
  FolderOpen,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ModeToggle } from "@/components/modeToggle"

interface Project {
  id: string
  name: string
  createdAt?: string
}

const ProjectsPage = () => {
  const [projects, setProjects] = React.useState<Project[]>([])
  const [newProjectName, setNewProjectName] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [renamingProjectId, setRenamingProjectId] = React.useState<string | null>(null)
  const [renameValue, setRenameValue] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects")
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch {
      console.error("Failed to fetch projects")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProject = async () => {
    if (newProjectName.trim()) {
      try {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newProjectName }),
        })
        if (res.ok) {
          const newProject = await res.json()
          setProjects([newProject, ...projects])
          setNewProjectName("")
          setIsDialogOpen(false)
        }
      } catch {
        console.error("Failed to create project")
      }
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects?id=${projectId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== projectId))
      }
    } catch {
      console.error("Failed to delete project")
    }
  }

  const handleRenameProject = async (projectId: string) => {
    if (renameValue.trim()) {
      try {
        const res = await fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: projectId, name: renameValue }),
        })
        if (res.ok) {
          setProjects(
            projects.map((p) =>
              p.id === projectId ? { ...p, name: renameValue.trim() } : p
            )
          )
          setRenamingProjectId(null)
          setRenameValue("")
        }
      } catch {
        console.error("Failed to rename project")
      }
    }
  }

  const openProject = (projectId: string) => {
    window.location.href = `/projects/${projectId}`
  }

  const startRename = (project: Project) => {
    setRenamingProjectId(project.id)
    setRenameValue(project.name)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and organize your projects</p>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No projects yet</h3>
          <p className="text-muted-foreground mb-4">Create your first project to get started</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="group relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {renamingProjectId === project.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          className="h-8"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleRenameProject(project.id)
                            }
                            if (e.key === "Escape") {
                              setRenamingProjectId(null)
                              setRenameValue("")
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleRenameProject(project.id)}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <h3 className="font-semibold truncate">{project.name}</h3>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {project.id}
                    </p>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48" align="end">
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => openProject(project.id)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => startRename(project)}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Rename
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-destructive"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Click to open project details and manage your work.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <Input
                placeholder="Enter project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateProject()
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>
                Create Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProjectsPage
