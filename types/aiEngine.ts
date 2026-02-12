export type AIInputType =
  | "options"
  | "number"
  | "text"
  | "multiselect"
  | "slider"
  | "chat"

export type AIOption = {
  id: string
  label: string
  next?: string
}

export type AIQuestionNode = {
  id: string
  type: AIInputType
  question: string
  insight?: string

  options?: AIOption[]

  min?: number
  max?: number
  step?: number
  placeholder?: string

  next?: string
}

export type AIWorkflow = {
  id: string
  title: string
  northStar: string
  start: string
  nodes: Record<string, AIQuestionNode>
}
