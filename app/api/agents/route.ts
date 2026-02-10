import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query, context, mode } = await request.json()

    const apiKey = process.env.GOOGLE_API_KEY
    
    if (!apiKey || apiKey === "your-google-api-key-here") {
      return NextResponse.json(
        { error: "Google API key not configured" },
        { status: 500 }
      )
    }

    const systemPrompts: Record<string, string> = {
      analyst: `You are a Data Analyst Agent. Analyze the query and provide insights.
Format your response as JSON with: findings (array of {insight, evidence, confidence}), metrics (object), trends (array of {direction, description, impact}), recommendations (array of strings).`,
      
      researcher: `You are a Research Agent. Research the query and provide comprehensive findings.
Format your response as JSON with: sources (array of {title, relevance, keyFindings, credibility}), synthesis (string), gaps (array), recommendations (array of {action, priority, rationale}).`,
      
      consultant: `You are a Consultant Agent. Provide strategic guidance.
Format your response as JSON with: assessment ({currentState, desiredState, gap, readiness}), recommendations (array of {initiative, impact, effort, timeline}), riskAssessment (array of {risk, likelihood, mitigation}), roadmap (array of {phase, initiatives, timeline}).`,
      
      manager: `You are a Manager Agent. Create project plans and task breakdowns.
Format your response as JSON with: taskBreakdown (array of {task, owner, deadline, status, priority}), timeline ({start, milestones: [{name, date, deliverables}], end}), riskLog (array of {risk, impact, probability, owner, mitigation}).`,
    }

    const prompt = systemPrompts[mode] || systemPrompts.analyst

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: `${prompt}\n\nContext: ${JSON.stringify(context)}\n\nQuery: ${query}` }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error("Google API error:", error)
      return NextResponse.json(
        { error: "Failed to get response from AI" },
        { status: 500 }
      )
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    let structured = null
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        structured = JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      // Return raw text if JSON parsing fails
    }

    return NextResponse.json({
      success: true,
      output: text,
      structured,
      mode,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Agent error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
