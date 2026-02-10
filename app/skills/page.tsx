"use client"

import * as React from "react"
import {
  Plus,
  MoreHorizontal,
  ExternalLink,
  Pencil,
  Trash2,
  Code,
  Eye,
  FolderOpen,
  FileText,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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

interface Skill {
  id: string
  name: string
  description: string
  category: string
  content?: string
  createdAt?: string
}

const categories = [
  { id: "analytics", name: "Analytics" },
  { id: "business", name: "Business" },
  { id: "integration", name: "Integration" },
  { id: "automation", name: "Automation" },
]

const SkillsPage = () => {
  const [skills, setSkills] = React.useState<Skill[]>([])
  const [newSkillName, setNewSkillName] = React.useState("")
  const [newSkillDescription, setNewSkillDescription] = React.useState("")
  const [newSkillCategory, setNewSkillCategory] = React.useState("analytics")
  const [newSkillContent, setNewSkillContent] = React.useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [selectedSkill, setSelectedSkill] = React.useState<Skill | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [viewTab, setViewTab] = React.useState("preview")
  const [editSkillId, setEditSkillId] = React.useState<string | null>(null)
  const [editContent, setEditContent] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills")
      if (res.ok) {
        const data = await res.json()
        setSkills(data)
      }
    } catch {
      console.error("Failed to fetch skills")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSkill = async () => {
    if (newSkillName.trim()) {
      try {
        const res = await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newSkillName,
            description: newSkillDescription,
            category: newSkillCategory,
            content: newSkillContent || `# ${newSkillName.trim()}\n\nAdd your skill content here.`,
          }),
        })
        if (res.ok) {
          const newSkill = await res.json()
          setSkills([newSkill, ...skills])
          setNewSkillName("")
          setNewSkillDescription("")
          setNewSkillCategory("analytics")
          setNewSkillContent("")
          setIsCreateDialogOpen(false)
        }
      } catch {
        console.error("Failed to create skill")
      }
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    try {
      const res = await fetch(`/api/skills?id=${skillId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setSkills(skills.filter((s) => s.id !== skillId))
        if (selectedSkill?.id === skillId) {
          setSelectedSkill(null)
        }
      }
    } catch {
      console.error("Failed to delete skill")
    }
  }

  const handleViewSkill = (skill: Skill) => {
    setSelectedSkill(skill)
    setEditContent(skill.content || "")
    setEditSkillId(null)
    setIsViewDialogOpen(true)
    setViewTab("preview")
  }

  const handleEditSkill = (skill: Skill) => {
    setEditSkillId(skill.id)
    setEditContent(skill.content || "")
    setViewTab("code")
  }

  const handleSaveEdit = async () => {
    if (selectedSkill && editSkillId) {
      try {
        const res = await fetch("/api/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editSkillId, content: editContent }),
        })
        if (res.ok) {
          setSkills(
            skills.map((s) =>
              s.id === editSkillId ? { ...s, content: editContent } : s
            )
          )
          setSelectedSkill({ ...selectedSkill, content: editContent })
          setEditSkillId(null)
        }
      } catch {
        console.error("Failed to update skill")
      }
    }
  }

  const openSkill = (skillId: string) => {
    window.location.href = `/skills/${skillId}`
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || categoryId
  }

  const renderMarkdown = (content: string) => {
    return content
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre class="bg-muted p-3 rounded-md overflow-x-auto"><code>$2</code></pre>')
      .replace(/`(.*)`/gim, '<code class="bg-muted px-1 py-0.5 rounded">$1</code>')
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
      .replace(/\n/gim, "<br />")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground">
            Manage and configure skills for business decisions
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Skill
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading skills...</p>
        </div>
      ) : skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No skills yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first skill to get started
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Skill
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Card key={skill.id} className="group relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {skill.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {skill.id} • {getCategoryName(skill.category)}
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
                          onClick={() => handleViewSkill(skill)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => openSkill(skill.id)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleEditSkill(skill)}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-destructive"
                          onClick={() => handleDeleteSkill(skill.id)}
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
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {skill.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Skill</DialogTitle>
            <DialogDescription>
              Create a new skill with markdown content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="skillName">Skill Name</Label>
                <Input
                  id="skillName"
                  placeholder="Enter skill name"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skillCategory">Category</Label>
                <Select value={newSkillCategory} onValueChange={setNewSkillCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skillDescription">Description</Label>
              <Input
                id="skillDescription"
                placeholder="Brief description of the skill"
                value={newSkillDescription}
                onChange={(e) => setNewSkillDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skillContent">Content (Markdown)</Label>
              <Tabs defaultValue="edit" className="w-full">
                <TabsList>
                  <TabsTrigger value="edit">
                    <Code className="h-4 w-4 mr-2" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="mt-2">
                  <textarea
                    id="skillContent"
                    className="w-full h-64 p-3 font-mono text-sm bg-muted rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="# Skill Title&#10;&#10;Describe your skill here..."
                    value={newSkillContent}
                    onChange={(e) => setNewSkillContent(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="preview" className="mt-2">
                  <div
                    className="h-64 p-3 border rounded-md overflow-auto prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(
                        newSkillContent || "# Preview\n\nStart typing to see preview..."
                      ),
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateSkill}>
                Create Skill
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedSkill?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedSkill?.id} • {selectedSkill ? getCategoryName(selectedSkill.category) : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedSkill && (
            <Tabs value={viewTab} onValueChange={setViewTab} className="w-full">
              <TabsList>
                <TabsTrigger value="preview">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code">
                  <Code className="h-4 w-4 mr-2" />
                  Code
                </TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-2">
                <div
                  className="h-[60vh] p-4 border rounded-md overflow-auto prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(selectedSkill.content || ""),
                  }}
                />
              </TabsContent>
              <TabsContent value="code" className="mt-2">
                <div className="relative">
                  {editSkillId === selectedSkill.id ? (
                    <>
                      <textarea
                        className="w-full h-[60vh] p-4 font-mono text-sm bg-muted rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditSkillId(null)
                            setEditContent(selectedSkill.content || "")
                          }}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveEdit}>
                          Save Changes
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <pre className="h-[60vh] p-4 bg-muted rounded-md overflow-auto">
                        <code className="text-sm">{selectedSkill.content}</code>
                      </pre>
                      <Button
                        className="mt-2"
                        size="sm"
                        onClick={() => handleEditSkill(selectedSkill)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SkillsPage
