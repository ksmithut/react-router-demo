import { Link } from 'react-router'
import { marked } from 'marked'
import type { Route } from './+types/_layout.notes.$noteId'
import { requireAuth } from '~/.server/auth'
import { fetchNote } from '~/.server/notes'

export async function loader(args: Route.LoaderArgs) {
  return requireAuth(args.request, async ({ userId }) => {
    const note = await fetchNote({ userId, noteId: args.params.noteId })
    if (!note) return { note }
    const rendered = await marked.parse(note.text)
    return { note: { ...note, rendered } }
  })
}

export default function NotePage({ loaderData }: Route.ComponentProps) {
  const { note } = loaderData
  if (!note) return <p>Note Not Found</p>
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col justify-between gap-3 rounded bg-slate-200 p-3 dark:bg-slate-700">
        <h2 className="text-2xl font-extrabold">{note.title}</h2>
        <div className="flex items-center gap-3">
          <Link
            className="underline"
            to={`/notes/${encodeURIComponent(note.id)}/edit`}
          >
            Edit
          </Link>
          <Link
            className="font-bold text-rose-700 underline dark:text-rose-400"
            to={`/notes/${encodeURIComponent(note.id)}/delete`}
          >
            Delete
          </Link>
        </div>
      </div>
      <div
        className="prose dark:prose-invert px-3"
        dangerouslySetInnerHTML={{ __html: note.rendered }}
      />
    </div>
  )
}
