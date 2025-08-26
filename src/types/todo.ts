export interface Todo {
  id: string
  title: string
  description: string | null
  completed: boolean
  priority: Priority
  createdAt: Date
  updatedAt: Date
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface CreateTodoData {
  title: string
  description?: string
  priority?: Priority
}

export interface UpdateTodoData {
  title?: string
  description?: string
  completed?: boolean
  priority?: Priority
}

export interface TodoResponse {
  success: boolean
  data?: Todo | Todo[]
  error?: string
}