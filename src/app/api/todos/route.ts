import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CreateTodoData } from '@/types/todo'

// GET /api/todos - Get all todos
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: [
        { completed: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: todos
    })
  } catch (error) {
    console.error('Error fetching todos:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch todos' },
      { status: 500 }
    )
  }
}

// POST /api/todos - Create new todo
export async function POST(request: NextRequest) {
  try {
    const body: CreateTodoData = await request.json()
    
    // Validation
    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }

    const todo = await prisma.todo.create({
      data: {
        title: body.title.trim(),
        description: body.description?.trim() || null,
        priority: body.priority || 'MEDIUM',
      }
    })

    return NextResponse.json({
      success: true,
      data: todo
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating todo:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create todo' },
      { status: 500 }
    )
  }
}