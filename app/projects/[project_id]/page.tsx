"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, MoreHorizontal, Pencil, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Project {
  id: string
  name: string
}

const initialProjects: Project[] = [
  { id: "marketing-dashboard", name: "Marketing Dashboard" },
  { id: "e-commerce-platform", name: "E-commerce Platform" },
  { id: "customer-analytics", name: "Customer Analytics" },
]

const ProjectPage = () => {
  const params = useParams()
  const router = useRouter()
  const projectId = params.project_id as string

  const [projects] = React.useState<Project[]>(initialProjects)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = React.useState(false)
  const [renameValue, setRenameValue] = React.useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [newName, setNewName] = React.useState("")

  const project = projects.find((p) => p.id === projectId)

  React.useEffect(() => {
    if (project) {
      setRenameValue(project.name)
      setNewName(project.name)
    }
  }, [project])

  const handleOpenProject = () => {
    if (project) {
      window.location.href = `/projects/${project.id}`
    }
  }

  const handleRename = () => {
    console.log("Rename project:", projectId, "to:", newName)
    setIsRenameDialogOpen(false)
  }

  const handleDelete = () => {
    console.log("Delete project:", projectId)
    setIsDeleteDialogOpen(false)
    router.push("/projects")
  }

  if (!project) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold">Project not found</h2>
            <p className="text-muted-foreground mb-4">
              The project &quot;{projectId}&quot; does not exist.
            </p>
            <Button onClick={() => router.push("/projects")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/projects")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48" align="start">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handleOpenProject}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setIsRenameDialogOpen(true)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-muted-foreground">ID: {project.id}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is the project detail page for &quot;{project.name}&quot;. 
            Project ID: {project.id}
          </p>
        </CardContent>
      </Card>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Change the name of your project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="rename">New Name</Label>
              <Input
                id="rename"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsRenameDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleRename}>
                Rename
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{project.name}&quot;? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProjectPage
