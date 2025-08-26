import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { UpdateTodoData } from '@/types/todo'

interface Params {
  params: { id: string }
}

// GET /api/todos/[id] - Get single todo
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: params.id }
    })

    if (!todo) {
      return NextResponse.json(
        { success: false, error: 'Todo not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: todo
    })
  } catch (error) {
    console.error('Error fetching todo:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch todo' },
      { status: 500 }
    )
  }
}

// PUT /api/todos/[id] - Update todo
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body: UpdateTodoData = await request.json()

    // Check if todo exists
    const existingTodo = await prisma.todo.findUnique({
      where: { id: params.id }
    })

    if (!existingTodo) {
      return NextResponse.json(
        { success: false, error: 'Todo not found' },
        { status: 404 }
      )
    }

    // Update todo
    const todo = await prisma.todo.update({
      where: { id: params.id },
      data: {
        ...(body.title && { title: body.title.trim() }),
        ...(body.description !== undefined && { 
          description: body.description?.trim() || null 
        }),
        ...(body.completed !== undefined && { completed: body.completed }),
        ...(body.priority && { priority: body.priority }),
      }
    })

    return NextResponse.json({
      success: true,
      data: todo
    })
  } catch (error) {
    console.error('Error updating todo:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update todo' },
      { status: 500 }
    )
  }
}

// DELETE /api/todos/[id] - Delete todo
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Check if todo exists
    const existingTodo = await prisma.todo.findUnique({
      where: { id: params.id }
    })

    if (!existingTodo) {
      return NextResponse.json(
        { success: false, error: 'Todo not found' },
        { status: 404 }
      )
    }

    await prisma.todo.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      data: { message: 'Todo deleted successfully' }
    })
  } catch (error) {
    console.error('Error deleting todo:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete todo' },
      { status: 500 }
    )
  }
}