import { Form, redirect, Link } from 'react-router'
import { fetchNote, deleteNote } from '~/.server/notes'
import { getString } from '~/utils/form-data'
import { requireAuth } from '~/.server/auth'
import { Button } from '~/components/button'
import type { Route } from './+types/_layout.notes.$noteId_.delete'

export async function action(args: Route.ActionArgs) {
  const formData = await args.request.formData()
  return requireAuth(args.request, async ({ userId }) => {
    const noteId = getString(formData, 'note_id')
    await deleteNote({ userId, noteId })
    return redirect('/notes')
  })
}

export async function loader(args: Route.LoaderArgs) {
  return requireAuth(args.request, async ({ userId }) => {
    const note = await fetchNote({ userId, noteId: args.params.noteId })
    if (!note) return redirect('/notes')
    return { note }
  })
}

export default function DeleteNote({ loaderData }: Route.ComponentProps) {
  const { note } = loaderData
  return (
    <Form method="POST" className="flex flex-col gap-3">
      <input type="hidden" name="note_id" value={note.id} />
      <p>
        Are you sure you want to delete "<span>{note.title}</span>"?
      </p>
      <div className="flex items-center gap-3">
        <Link
          className="underline"
          to={`/notes/${encodeURIComponent(note.id)}`}
        >
          Cancel
        </Link>
        <Button style="danger">Delete</Button>
      </div>
    </Form>
  )
}
