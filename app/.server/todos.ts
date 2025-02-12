import { and, eq } from 'drizzle-orm'
import { db } from './db'
import * as schema from './schema'

export async function listTodos({ userId }: { userId: string }) {
  return db.query.todos.findMany({
    where: (todos, { eq }) => eq(todos.userId, userId),
    orderBy: (todos, { asc }) => asc(todos.createdAt),
  })
}

export async function fetchTodo({
  userId,
  todoId,
}: {
  userId: string
  todoId: string
}) {
  return db.query.todos.findFirst({
    where: (todos, { and, eq }) =>
      and(eq(todos.id, todoId), eq(todos.userId, userId)),
  })
}

export async function createTodo({
  userId,
  label,
}: {
  userId: string
  label: string
}) {
  const todoId = crypto.randomUUID()
  await db.insert(schema.todos).values({
    id: todoId,
    userId,
    createdAt: new Date(),
    label,
  })
  return { todoId }
}

export async function completeTodo({
  userId,
  todoId,
}: {
  userId: string
  todoId: string
}) {
  const [todo] = await db
    .update(schema.todos)
    .set({
      completedAt: new Date(),
    })
    .where(and(eq(schema.todos.id, todoId), eq(schema.todos.userId, userId)))
    .returning()
  if (!todo) return null
  return todo
}

export async function uncompleteTodo({
  userId,
  todoId,
}: {
  userId: string
  todoId: string
}) {
  const [todo] = await db
    .update(schema.todos)
    .set({
      completedAt: null,
    })
    .where(and(eq(schema.todos.id, todoId), eq(schema.todos.userId, userId)))
    .returning()
  if (!todo) return null
  return todo
}

export async function deleteTodo({
  userId,
  todoId,
}: {
  userId: string
  todoId: string
}) {
  const [todo] = await db
    .delete(schema.todos)
    .where(and(eq(schema.todos.id, todoId), eq(schema.todos.userId, userId)))
    .returning()
  if (!todo) return null
  return todo
}
