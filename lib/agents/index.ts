// Agent modules - uses direct API calls in /app/api/agents/route.ts
// See API route for implementation

export interface AgentContext {
  projectId?: string
  projectName?: string
  userId?: string
  sessionId?: string
  relevantData?: Record<string, unknown>
}

export interface AgentIntent {
  type: "analysis" | "research" | "consultation" | "management" | "orchestration"
  priority: "high" | "medium" | "low"
  goals: string[]
  constraints?: string[]
}

export interface AgentResult {
  success: boolean
  output: string
  actions?: string[]
  recommendations?: string[]
  nextSteps?: string[]
  metadata?: Record<string, unknown>
}

export type AgentMode = "analyst" | "researcher" | "consultant" | "manager"
