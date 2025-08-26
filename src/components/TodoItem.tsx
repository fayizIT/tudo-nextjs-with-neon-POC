'use client'
import { useState } from 'react'
import { Todo, Priority } from '@/types/todo'
import TodoForm from './TodoForm'

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: string, data: any) => void
  onDelete: (id: string) => void
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'URGENT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleToggleComplete = () => {
    onUpdate(todo.id, { completed: !todo.completed })
  }

  const handleEdit = (data: any) => {
    onUpdate(todo.id, data)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4">
        <TodoForm
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
          initialData={{
            title: todo.title,
            description: todo.description || '',
            priority: todo.priority
          }}
          submitText="Update Todo"
        />
      </div>
    )
  }

  return (
    <div className={`border rounded-lg p-4 ${todo.completed ? 'bg-gray-50 opacity-75' : 'bg-white'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className={`mt-1 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                {todo.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(todo.priority)}`}>
                {todo.priority}
              </span>
              <span className="text-xs text-gray-500">
                Created: {new Date(todo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this todo?')) {
                onDelete(todo.id)
              }
            }}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}