// test-imports.ts (create this file temporarily in your root)
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Try to access the types - this should show what's available
type TestTodo = any // This should auto-complete if Todo exists

console.log('Prisma client loaded successfully')