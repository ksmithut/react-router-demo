import { Form, Link, redirect } from 'react-router'
import { FieldGroup, Label, Input, TextArea } from '~/components/forms'
import { Button } from '~/components/button'
import { getString } from '~/utils/form-data'
import { requireAuth } from '~/.server/auth'
import { createNote } from '~/.server/notes'
import type { Route } from './+types/_layout.notes.new'

export async function action(args: Route.ActionArgs) {
  const formData = await args.request.formData()
  return requireAuth(args.request, async ({ userId }) => {
    const title = getString(formData, 'title')
    const text = getString(formData, 'text')
    const { noteId } = await createNote({ text, title, userId })
    return redirect(`/notes/${encodeURIComponent(noteId)}`, { status: 303 })
  })
}

export default function NewNote(props: Route.ComponentProps) {
  return (
    <Form
      method="POST"
      className="flex flex-col gap-3 rounded bg-slate-200 p-3 shadow dark:bg-slate-700"
    >
      <h2>New Note</h2>
      <FieldGroup>
        <Label htmlFor="new_note_title">Title</Label>
        <Input id="new_note_title" name="title" required />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="new_note_text">Text</Label>
        <TextArea
          id="new_note_text"
          name="text"
          className="font-mono"
          autoResize
        />
      </FieldGroup>
      <div className="flex items-center gap-3">
        <Link to="/notes">Cancel</Link>
        <Button>Create</Button>
      </div>
    </Form>
  )
}
