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
import { Label } from "@/components/ui/label"
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

interface Project {
  id: string
  name: string
}

const initialProjects: Project[] = [
  { id: "marketing-dashboard", name: "Marketing Dashboard" },
  { id: "e-commerce-platform", name: "E-commerce Platform" },
  { id: "customer-analytics", name: "Customer Analytics" },
]

const ProjectsPage = () => {
  const [projects, setProjects] = React.useState<Project[]>(initialProjects)
  const [newProjectName, setNewProjectName] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [renamingProjectId, setRenamingProjectId] = React.useState<string | null>(null)
  const [renameValue, setRenameValue] = React.useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const slug = newProjectName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      const newProject: Project = {
        id: slug,
        name: newProjectName.trim(),
      }
      setProjects([...projects, newProject])
      setNewProjectName("")
      setIsCreateDialogOpen(false)
    }
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId))
  }

  const handleRenameProject = (projectId: string) => {
    if (renameValue.trim()) {
      setProjects(
        projects.map((p) =>
          p.id === projectId ? { ...p, name: renameValue.trim() } : p
        )
      )
      setRenamingProjectId(null)
      setRenameValue("")
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
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No projects yet</h3>
          <p className="text-muted-foreground mb-4">Create your first project to get started</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
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

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
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
                onClick={() => setIsCreateDialogOpen(false)}
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
