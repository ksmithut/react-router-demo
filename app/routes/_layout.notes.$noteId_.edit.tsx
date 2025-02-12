import { Form, Link, redirect } from 'react-router'
import { FieldGroup, Input, TextArea, Label } from '~/components/forms'
import { Button } from '~/components/button'
import { getString } from '~/utils/form-data'
import { requireAuth } from '~/.server/auth'
import { fetchNote, updateNote } from '~/.server/notes'
import type { Route } from './+types/_layout.notes.$noteId_.edit'

export async function action(args: Route.ActionArgs) {
  const formData = await args.request.formData()
  return requireAuth(args.request, async ({ userId }) => {
    const noteId = getString(formData, 'note_id')
    const title = getString(formData, 'title')
    const text = getString(formData, 'text')
    await updateNote({ userId, noteId, text, title })
    return redirect(`/notes/${encodeURIComponent(noteId)}`)
  })
}

export async function loader(args: Route.LoaderArgs) {
  return requireAuth(args.request, async ({ userId }) => {
    const note = await fetchNote({ userId, noteId: args.params.noteId })
    if (!note) return redirect('/notes')
    return { note }
  })
}

export default function EditNote({ loaderData }: Route.ComponentProps) {
  const { note } = loaderData
  return (
    <Form
      method="POST"
      className="flex flex-col gap-3 rounded bg-slate-200 p-3 shadow dark:bg-slate-700"
    >
      <input type="hidden" name="note_id" value={note.id} />
      <FieldGroup>
        <Label htmlFor="edit_note_title">Title</Label>
        <Input
          id="edit_note_title"
          name="title"
          required
          defaultValue={note.title}
        />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="edit_note_text">Text</Label>
        <TextArea
          id="edit_note_text"
          name="text"
          className="font-mono"
          defaultValue={note.text}
          autoResize
        />
      </FieldGroup>
      <div className="flex items-center gap-3">
        <Link to={`/notes/${encodeURIComponent(note.id)}`}>Cancel</Link>
        <Button>Save</Button>
      </div>
    </Form>
  )
}
