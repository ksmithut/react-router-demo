import { createCookie, redirect } from 'react-router'
import { eq, and, gte } from 'drizzle-orm'
import * as argon2 from 'argon2'
import * as v from 'valibot'
import { db } from './db'
import * as schema from './schema'
import { issuesToPathMap, createIssues } from '~/utils/valibot-issues'

const sessionCookie = createCookie('sid', {
  httpOnly: true,
  sameSite: 'lax',
  secrets: process.env.COOKIE_SECRETS!?.trim().split(/\s+/),
  secure: process.env.COOKIE_SECURE === 'true',
})

export const parseSignUpArgs = v.safeParser(
  v.object({
    username: v.pipe(v.string(), v.minLength(4)),
    password: v.pipe(v.string(), v.trim(), v.minLength(12)),
  }),
)

function addDays(date: Date, days: number) {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

export async function signUp({
  username,
  password,
}: {
  username: string
  password: string
}) {
  const parseResult = parseSignUpArgs({ username, password })
  if (!parseResult.success) {
    return {
      success: false,
      issues: issuesToPathMap(parseResult.issues),
    } as const
  }
  const passwordDigest = await argon2.hash(parseResult.output.password, {
    type: argon2.argon2id,
  })
  const userId = crypto.randomUUID()
  return db
    .insert(schema.users)
    .values({
      id: userId,
      username: parseResult.output.username,
      passwordDigest,
    })
    .returning()
    .then((res) => {
      return { success: true, userId } as const
    })
    .catch((err) => {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return {
          success: false,
          issues: createIssues('username', ['Username already registered']),
        } as const
      }
      throw err
    })
}

export async function initializeSession({ userId }: { userId: string }) {
  const sessionId = crypto.randomUUID()
  const now = new Date()
  const expiresAt = addDays(now, 2)
  await db
    .insert(schema.sessions)
    .values({ id: sessionId, userId, createdAt: now, expiresAt })
  return sessionCookie.serialize(sessionId, {
    expires: expiresAt,
  })
}

export const parseSignInArgs = v.safeParser(
  v.object({
    username: v.string(),
    password: v.string(),
  }),
)

export async function signIn({
  username,
  password,
}: {
  username: string
  password: string
}) {
  const parseResult = parseSignInArgs({ username, password })
  if (!parseResult.success) {
    return {
      success: false,
      issues: issuesToPathMap(parseResult.issues),
    } as const
  }
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  })
  if (!user)
    return {
      success: false,
      issues: createIssues('password', ['Invalid username or password']),
    } as const
  const passwordMatches = await argon2.verify(user.passwordDigest, password)
  if (!passwordMatches)
    return {
      success: false,
      issues: createIssues('password', ['Invalid username or password']),
    } as const
  return { success: true, userId: user.id } as const
}

export async function getSession(request: Request) {
  const cookie = request.headers.get('cookie')
  if (!cookie) return null
  const sessionId = await sessionCookie.parse(cookie)
  if (!sessionId) return null
  const now = new Date()
  const session = await db.query.sessions.findFirst({
    where: (sessions, { and, eq, gte }) =>
      and(eq(sessions.id, sessionId), gte(sessions.expiresAt, now)),
  })
  if (!session) return null
  return session
}

type Session = Exclude<Awaited<ReturnType<typeof getSession>>, null>

export async function requireAuth<T>(
  request: Request,
  getLoaderData: (session: Session) => T,
): Promise<Response | Awaited<T>> {
  const session = await getSession(request)
  if (!session) {
    return redirect(`/sign-in`, { status: 303 })
  }
  const loaderData = await getLoaderData(session)
  return loaderData
}

export async function signOut(request: Request) {
  const session = await getSession(request)
  if (session) {
    await db.delete(schema.sessions).where(eq(schema.sessions.id, session.id))
  }
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionCookie.serialize('', { expires: new Date(0) }),
    },
  })
}
