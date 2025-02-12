import { Outlet, NavLink, Form } from 'react-router'
import clsx from 'clsx'
import type { Route } from './+types/_layout'
import { getSession } from '~/.server/auth'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'React Router App' },
    { name: 'description', content: 'Create some todos' },
  ]
}

export async function loader(args: Route.LoaderArgs) {
  const session = await getSession(args.request)
  return { session }
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { session } = loaderData
  return (
    <div className="w-screen">
      <nav className="flex w-full justify-between bg-black/10 p-3 dark:bg-white/10">
        <ul className="flex gap-5">
          {session && (
            <>
              <li>
                <NavLink
                  to="/todos"
                  className={({ isActive }) => clsx(isActive && 'underline')}
                >
                  Todos
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/notes"
                  className={({ isActive }) => clsx(isActive && 'underline')}
                >
                  Notes
                </NavLink>
              </li>
              <li>
                <Form action="/sign-out" method="POST">
                  <button className="cursor-pointer">Sign Out</button>
                </Form>
              </li>
            </>
          )}
          {!session && (
            <>
              <li>
                <NavLink to="/sign-in">Sign In</NavLink>
              </li>
              <li>
                <NavLink to="/sign-up">Sign Up</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      <main className="w-screen p-3">
        <Outlet />
      </main>
    </div>
  )
}
