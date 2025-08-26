import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest, context: any) {
  try {
    const { id } = await context.params
    
    const todo = await prisma.todo.findUnique({
      where: { id }
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

export async function PUT(request: NextRequest, context: any) {
  try {
    const { id } = await context.params
    const body = await request.json()

    const existingTodo = await prisma.todo.findUnique({
      where: { id }
    })

    if (!existingTodo) {
      return NextResponse.json(
        { success: false, error: 'Todo not found' },
        { status: 404 }
      )
    }

    const todo = await prisma.todo.update({
      where: { id },
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

export async function DELETE(request: NextRequest, context: any) {
  try {
    const { id } = await context.params

    const existingTodo = await prisma.todo.findUnique({
      where: { id }
    })

    if (!existingTodo) {
      return NextResponse.json(
        { success: false, error: 'Todo not found' },
        { status: 404 }
      )
    }

    await prisma.todo.delete({
      where: { id }
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