"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  Home,
  Box,
  Wrench,
  Plus,
  ChevronDown,
  Search,
  Layers,
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface Project {
  id: string
  name: string
  createdAt?: string
}

const teams = [
  { id: "1", name: "Team A" },
  { id: "2", name: "Team B" },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [projects, setProjects] = React.useState<Project[]>([])
  const [newProjectName, setNewProjectName] = React.useState("")
  const [isProjectsOpen, setIsProjectsOpen] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
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

  const handleAddProject = async () => {
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

  const startRename = (project: Project) => {
    setRenamingProjectId(project.id)
    setRenameValue(project.name)
  }

  const openProject = (projectId: string) => {
    window.location.href = `/projects/${projectId}`
  }

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Sidebar collapsible="icon" className="bg-stone-100 border-stone-200" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger asChild>
                <SidebarMenuButton className="w-full justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                      <Image src={"/icon-entity.png"} alt="" width={16} height={16}  className="h-5 w-5 text-stone-100" />
                    </div>
                    <span className="font-semibold">Entity</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="start" side="right">
                <div className="space-y-1">
                  <p className="text-sm font-medium px-2 py-1">Teams</p>
                  {teams.map((team) => (
                    <Button
                      key={team.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      {team.name}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground"
                  >
                    + Add Team
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Search">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/projects">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Connectors">
                  <Box className="h-4 w-4" />
                  <span>Connectors</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/skills">
                    <Wrench className="h-4 w-4" />
                    <span>Skills</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <Collapsible
            open={isProjectsOpen}
            onOpenChange={setIsProjectsOpen}
            defaultOpen
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="w-full justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span className="font-medium">Projects</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isProjectsOpen ? "rotate-180" : ""
                  }`}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <SidebarMenuButton className="w-full justify-start cursor-pointer">
                      <Plus className="h-4 w-4" />
                      <span>New Project</span>
                    </SidebarMenuButton>
                  </PopoverTrigger>
                  <PopoverContent className="w-72" align="start" side="right">
                    <div className="grid gap-4 p-2">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">New Project</h4>
                        <p className="text-xs text-muted-foreground">
                          Create a new project to organize your work.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <div className="grid gap-1.5">
                          <Label htmlFor="sidebar-project-name">Project Name</Label>
                          <Input
                            id="sidebar-project-name"
                            placeholder="Enter project name"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleAddProject()
                              }
                            }}
                          />
                        </div>
                        <Button size="sm" onClick={handleAddProject}>
                          Create Project
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="space-y-1">
                  <Input
                    placeholder="Filter projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8"
                  />
                  {isLoading ? (
                    <p className="text-xs text-muted-foreground px-2">
                      Loading...
                    </p>
                  ) : filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center gap-1 group/menu-item relative"
                      >
                        {renamingProjectId === project.id ? (
                          <div className="flex-1 flex gap-1 px-2">
                            <Input
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              className="h-7 text-xs"
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
                              variant="ghost"
                              className="h-7 px-1"
                              onClick={() => handleRenameProject(project.id)}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <>
                            <SidebarMenuButton
                              className="flex-1 justify-start cursor-pointer"
                              asChild
                            >
                              <a href={`/projects/${project.id}`}>
                                <span className="truncate">{project.name}</span>
                              </a>
                            </SidebarMenuButton>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover/menu-item:opacity-100"
                                >
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-48" align="end" side="right">
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
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground px-2">
                      No projects found.
                    </p>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger asChild>
                <SidebarMenuButton className="w-full justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-300">
                      <span className="text-sm font-medium">U</span>
                    </div>
                    <span>User</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="start" side="right">
                <div className="space-y-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Profile Settings
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Preferences
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                    Sign Out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
