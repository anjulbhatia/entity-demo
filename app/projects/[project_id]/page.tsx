"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  Send,
  Paperclip,
  ChevronDown,
  Share2,
  FileText,
  Users,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Plus,
  Image,
  File,
  Database,
  Link2,
  Zap,
  Search,
  Keyboard,
} from "lucide-react"
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
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Project {
  id: string
  name: string
}

const initialProjects: Project[] = [
  { id: "marketing-dashboard", name: "Marketing Dashboard" },
  { id: "e-commerce-platform", name: "E-commerce Platform" },
  { id: "customer-analytics", name: "Customer Analytics" },
]

const models = [
  { id: "gemini-3-pro", name: "Gemini 3 Pro Preview" },
  { id: "openai-o5", name: "OpenAI o5-2" },
  { id: "claude-sonnet", name: "Claude Sonnet 4" },
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "deepseek-r1", name: "DeepSeek R1" },
]

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  mode?: string
  timestamp: string
}

const ProjectPage = () => {
  const params = useParams()
  const router = useRouter()
  const projectId = params.project_id as string
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const [projects] = React.useState<Project[]>(initialProjects)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = React.useState(false)
  const [renameValue, setRenameValue] = React.useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [newName, setNewName] = React.useState("")
  const [selectedModel, setSelectedModel] = React.useState("gemini-1.5-pro")
  const [mode, setMode] = React.useState<"analyst" | "researcher" | "consultant" | "manager">("analyst")
  const [chatInput, setChatInput] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("decision")
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const project = projects.find((p) => p.id === projectId)

  React.useEffect(() => {
    if (project) {
      setRenameValue(project.name)
      setNewName(project.name)
    }
  }, [project])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "k") {
          e.preventDefault()
          setIsSearchOpen(true)
        } else if (e.key === "/") {
          e.preventDefault()
          textareaRef.current?.focus()
        }
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "Enter") {
          e.preventDefault()
          handleSendMessage()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [chatInput, isLoading])

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

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      mode,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage.content,
          context: {
            projectId,
            projectName: project?.name,
          },
          mode,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.output,
          mode: data.mode,
          timestamp: data.timestamp,
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error("Failed to get AI response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = () => {
    console.log("Sharing project:", projectId)
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Project not found</h2>
          <p className="text-muted-foreground mb-4">
            The project &quot;{projectId}&quot; does not exist.
          </p>
          <Button onClick={() => router.push("/projects")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center justify-between px-6 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/projects")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer" onClick={() => router.push("/projects")}>
              Projects
            </span>
            <ChevronDown className="h-4 w-4" />
            <span className="font-medium text-foreground">{project.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              <div className="space-y-1">
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
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="font-medium text-sm">AI Assistant</div>
                  <div className="bg-muted rounded-lg p-4 text-sm">
                    <p>Hello! I&apos;m here to help you with <strong>{project.name}</strong>.</p>
                    <p className="mt-2">What would you like to work on today? You can:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Analyze your data</li>
                      <li>Create insights and reports</li>
                      <li>Build dashboards</li>
                      <li>Automate workflows</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user" ? "bg-muted" : "bg-primary/10"
                  }`}>
                    {message.role === "user" ? (
                      <span className="text-sm font-medium">U</span>
                    ) : (
                      <Sparkles className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {message.role === "user" ? "You" : `${(message.mode || "AI").charAt(0).toUpperCase()}${(message.mode || "AI").slice(1)} Agent`}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="font-medium text-sm">AI Assistant</div>
                  <div className="bg-muted rounded-lg p-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t bg-background p-4">
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56" align="start">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground px-2 py-1">Add Attachment</p>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <Image className="h-4 w-4 mr-2" />
                          Media / Image
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <File className="h-4 w-4 mr-2" />
                          Document / File
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <Database className="h-4 w-4 mr-2" />
                          Data Connector
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <Link2 className="h-4 w-4 mr-2" />
                          Link / URL
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Search (Ctrl+K)">
                        <Search className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                  </Popover>
                  <textarea
                    ref={textareaRef}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask anything... (Ctrl+/ to focus, Ctrl+Enter to send)"
                    className="flex-1 min-h-[80px] max-h-[200px] p-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                      if (e.key === "Escape") {
                        textareaRef.current?.blur()
                      }
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Select value={mode} onValueChange={(v) => setMode(v as "analyst" | "researcher" | "consultant" | "manager")}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="researcher">Researcher</SelectItem>
                      <SelectItem value="consultant">Consultant</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="w-[180px]">
                      <Zap className="h-3.5 w-3.5 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isLoading}
                className="h-full row-span-2 px-4"
                size="lg"
              >
                {isLoading ? (
                  <Sparkles className="h-5 w-5 animate-pulse" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="w-80 border-l bg-background flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className="w-full justify-start p-0 border-b bg-transparent h-auto">
              <TabsTrigger
                value="decision"
                className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-muted/50"
              >
                <FileText className="h-4 w-4 mr-2" />
                Decision Memo
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-muted/50"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Resources
              </TabsTrigger>
              <TabsTrigger
                value="teams"
                className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-muted/50"
              >
                <Users className="h-4 w-4 mr-2" />
                Teams
              </TabsTrigger>
            </TabsList>
            <TabsContent value="decision" className="flex-1 overflow-y-auto p-4 m-0">
              <div className="space-y-4">
                <div className="text-sm font-medium">Decision Memo</div>
                <p className="text-sm text-muted-foreground">
                  AI-generated decisions and recommendations will appear here.
                </p>
                <div className="bg-muted rounded-lg p-4 text-sm">
                  <p className="font-medium">No decisions yet</p>
                  <p className="text-muted-foreground mt-1">
                    Start a conversation to generate decision memos.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="resources" className="flex-1 overflow-y-auto p-4 m-0">
              <div className="space-y-4">
                <div className="text-sm font-medium">Resources</div>
                <p className="text-sm text-muted-foreground">
                  Related resources and assets will appear here.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">No resources attached</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="teams" className="flex-1 overflow-y-auto p-4 m-0">
              <div className="space-y-4">
                <div className="text-sm font-medium">Teams</div>
                <p className="text-sm text-muted-foreground">
                  Team members and collaborators will appear here.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium">U</span>
                    </div>
                    <span className="text-sm">User</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

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

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Search conversations, projects, and more... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              autoFocus
            />
            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    setChatInput("Analyze my project data")
                    setIsSearchOpen(false)
                    textareaRef.current?.focus()
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    setChatInput("Research market trends")
                    setIsSearchOpen(false)
                    textareaRef.current?.focus()
                  }}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Research Trends
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    setChatInput("Generate a report")
                    setIsSearchOpen(false)
                    textareaRef.current?.focus()
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    router.push("/projects")
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Projects
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Press Ctrl+K to open search</span>
              <span>Press Esc to close</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProjectPage
