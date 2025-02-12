import { NavLink, Outlet } from 'react-router'
import clsx from 'clsx'
import type { Route } from './+types/_layout.notes'
import { requireAuth } from '~/.server/auth'
import { listNotes } from '~/.server/notes'

export async function loader(args: Route.ActionArgs) {
  return requireAuth(args.request, async ({ userId }) => {
    const notes = await listNotes({ userId })
    return { notes }
  })
}

export default function NotesPage({ loaderData }: Route.ComponentProps) {
  const { notes } = loaderData
  return (
    <div className="flex w-full gap-3">
      <div>
        <ul className="flex flex-col gap-3 rounded bg-slate-200 p-3 dark:bg-slate-700">
          <li>
            <NavLink to="/notes/new">+ New Note</NavLink>
          </li>
          {notes.map((note) => (
            <li key={note.id} className="w-full">
              <NavLink
                to={`/notes/${encodeURIComponent(note.id)}`}
                className={({ isActive }) =>
                  clsx(
                    isActive
                      ? 'bg-slate-300 dark:bg-slate-600'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-500',
                    'inline-block w-full rounded px-2 py-1',
                  )
                }
              >
                {note.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="grow">
        <Outlet />
      </div>
    </div>
  )
}
