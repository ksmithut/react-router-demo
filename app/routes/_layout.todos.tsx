import { Form } from 'react-router'
import clsx from 'clsx'
import { requireAuth } from '~/.server/auth'
import {
  listTodos,
  completeTodo,
  uncompleteTodo,
  deleteTodo,
  createTodo,
} from '~/.server/todos'
import { getString } from '~/utils/form-data'
import type { Route } from './+types/_layout.todos'

export async function action(args: Route.ActionArgs) {
  return requireAuth(args.request, async ({ userId }) => {
    const formData = await args.request.formData()
    switch (formData.get('action')) {
      case 'create': {
        const label = getString(formData, 'label')
        await createTodo({ label, userId })
        return
      }
      case 'complete': {
        const todoId = getString(formData, 'todo_id')
        await completeTodo({ todoId, userId })
        return
      }
      case 'uncomplete': {
        const todoId = getString(formData, 'todo_id')
        await uncompleteTodo({ todoId, userId })
        return
      }
      case 'delete': {
        const todoId = getString(formData, 'todo_id')
        await deleteTodo({ todoId, userId })
        return
      }
    }
  })
}

export async function loader(args: Route.LoaderArgs) {
  return requireAuth(args.request, async (session) => {
    return { todos: await listTodos({ userId: session.userId }) }
  })
}

export default function Todos({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col items-center">
      <Form
        method="POST"
        className="rounded bg-slate-200 p-3 shadow dark:bg-slate-700"
        onSubmit={(e) => {
          const form = e.currentTarget
          setTimeout(() => form.reset(), 0)
        }}
      >
        <input type="hidden" name="action" value="create" />
        <input
          id="newTodoLabel"
          className="rounded bg-slate-50 px-3 py-2 shadow-inner shadow-slate-300 dark:bg-slate-600 dark:shadow-slate-700"
          placeholder="New Todo"
          name="label"
          required
        />
      </Form>
      {loaderData.todos.length > 0 && (
        <ul className="mt-4 flex min-w-sm flex-col gap-3 rounded bg-slate-200 p-3 dark:bg-slate-700">
          {loaderData.todos.map((todo) => (
            <li
              key={todo.id}
              className="group justify-between rounded bg-slate-300 hover:bg-slate-100 dark:bg-slate-600 dark:hover:bg-slate-500"
            >
              <Form method="POST" className="flex grow items-center gap-2 px-2">
                <input type="hidden" name="todo_id" value={todo.id} />
                <button
                  name="action"
                  value={todo.completedAt ? 'uncomplete' : 'complete'}
                  className={clsx(
                    todo.completedAt &&
                      'text-gray-500 line-through dark:text-gray-400',
                    'grow cursor-pointer py-2 text-left',
                  )}
                >
                  {todo.label}
                </button>
                <button
                  name="action"
                  value="delete"
                  className="h-full cursor-pointer items-center justify-center rounded px-2 py-1 font-extrabold text-rose-700 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-rose-300/50 dark:text-rose-400 dark:hover:bg-rose-700/50"
                >
                  ✘
                </button>
              </Form>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
