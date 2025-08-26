'use client'
import { useState } from 'react'
import { Priority } from '@/types/todo'

interface TodoFormProps {
  onSubmit: (data: { title: string; description: string; priority: Priority }) => void
  onCancel?: () => void
  initialData?: {
    title?: string
    description?: string
    priority?: Priority
  }
  submitText?: string
}

export default function TodoForm({ 
  onSubmit, 
  onCancel, 
  initialData = {}, 
  submitText = 'Add Todo' 
}: TodoFormProps) {
  const [title, setTitle] = useState(initialData.title || '')
  const [description, setDescription] = useState(initialData.description || '')
  const [priority, setPriority] = useState<Priority>(initialData.priority || 'MEDIUM')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit({ title, description, priority })
      if (!initialData.title) {
        // Only reset if it's a new todo
        setTitle('')
        setDescription('')
        setPriority('MEDIUM')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg border-black">
      <div className='text-black'>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter todo title"
          required
        />
      </div>

      <div  className='text-black'>
        <label htmlFor="description" className="block text-sm font-medium mb-1 ">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 "
          placeholder="Enter todo description (optional)"
          rows={3}
        />
      </div>

      <div className='text-black'>
        <label htmlFor="priority" className="block text-sm font-medium mb-1">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {submitText}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}