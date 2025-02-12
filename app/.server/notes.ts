import { and, eq } from 'drizzle-orm'
import { db } from './db'
import * as schema from './schema'

export async function listNotes({ userId }: { userId: string }) {
  return db.query.notes.findMany({
    where: (notes, { eq }) => eq(notes.userId, userId),
    orderBy: (notes, { asc }) => asc(notes.createdAt),
    columns: {
      id: true,
      title: true,
    },
  })
}

export async function fetchNote({
  userId,
  noteId,
}: {
  userId: string
  noteId: string
}) {
  return db.query.notes.findFirst({
    where: (notes, { eq, and }) =>
      and(eq(notes.id, noteId), eq(notes.userId, userId)),
  })
}

export async function createNote({
  userId,
  title,
  text,
}: {
  userId: string
  title: string
  text: string
}) {
  const noteId = crypto.randomUUID()
  await db.insert(schema.notes).values({
    id: noteId,
    userId,
    title,
    text,
    createdAt: new Date(),
  })
  return { noteId }
}

export async function updateNote({
  userId,
  noteId,
  title,
  text,
}: {
  userId: string
  noteId: string
  title: string
  text: string
}) {
  const [note] = await db
    .update(schema.notes)
    .set({ title, text })
    .where(and(eq(schema.notes.id, noteId), eq(schema.notes.userId, userId)))
    .returning()
  if (!note) return null
  return note
}

export async function deleteNote({
  userId,
  noteId,
}: {
  userId: string
  noteId: string
}) {
  const [note] = await db
    .delete(schema.notes)
    .where(and(eq(schema.notes.id, noteId), eq(schema.notes.userId, userId)))
    .returning()
  if (!note) return null
  return note
}
