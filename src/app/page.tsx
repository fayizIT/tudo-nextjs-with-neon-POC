'use client'
import { useState, useEffect } from 'react'
import { Todo, Priority, TodoResponse } from '@/types/todo'
import TodoForm from '@/components/TodoForm'
import TodoItem from '@/components/TodoItem'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      const data: TodoResponse = await response.json()
      
      if (data.success && Array.isArray(data.data)) {
        setTodos(data.data)
      } else {
        setError('Failed to load todos')
      }
    } catch (err) {
      setError('Failed to load todos')
      console.error('Error fetching todos:', err)
    } finally {
      setLoading(false)
    }
  }

  // Add todo
  const addTodo = async (todoData: { title: string; description: string; priority: Priority }) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoData)
      })
      
      const data: TodoResponse = await response.json()
      
      if (data.success && data.data && !Array.isArray(data.data)) {
        setTodos(prev => [data.data as Todo, ...prev])
        setShowAddForm(false)
      } else {
        alert('Failed to add todo')
      }
    } catch (err) {
      alert('Failed to add todo')
      console.error('Error adding todo:', err)
    }
  }

  // Update todo
  const updateTodo = async (id: string, updateData: any) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      
      const data: TodoResponse = await response.json()
      
      if (data.success && data.data && !Array.isArray(data.data)) {
        setTodos(prev => prev.map(todo => 
          todo.id === id ? data.data as Todo : todo
        ))
      } else {
        alert('Failed to update todo')
      }
    } catch (err) {
      alert('Failed to update todo')
      console.error('Error updating todo:', err)
    }
  }

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setTodos(prev => prev.filter(todo => todo.id !== id))
      } else {
        alert('Failed to delete todo')
      }
    } catch (err) {
      alert('Failed to delete todo')
      console.error('Error deleting todo:', err)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading todos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const completedTodos = todos.filter(todo => todo.completed)
  const pendingTodos = todos.filter(todo => !todo.completed)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo App</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{todos.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{pendingTodos.length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{completedTodos.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Add Todo Button/Form */}
        <div className="mb-6">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + Add New Todo
            </button>
          ) : (
            <TodoForm
              onSubmit={addTodo}
              onCancel={() => setShowAddForm(false)}
            />
          )}
        </div>

        {/* Todo Lists */}
        <div className="space-y-6">
          {/* Pending Todos */}
          {pendingTodos.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Pending Tasks ({pendingTodos.length})
              </h2>
              <div className="space-y-3">
                {pendingTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={updateTodo}
                    onDelete={deleteTodo}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Todos */}
          {completedTodos.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Completed Tasks ({completedTodos.length})
              </h2>
              <div className="space-y-3">
                {completedTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={updateTodo}
                    onDelete={deleteTodo}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {todos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No todos yet</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first todo!</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Your First Todo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}