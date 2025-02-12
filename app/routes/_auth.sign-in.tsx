import { Form, Link, redirect, useSearchParams } from 'react-router'
import { signIn, initializeSession, getSession } from '~/.server/auth'
import { FieldGroup, Label, Input, Issues } from '~/components/forms'
import { Button } from '~/components/button'
import { getString } from '~/utils/form-data'
import type { Route } from './+types/_auth.sign-in'

export async function action(args: Route.ActionArgs) {
  const formData = await args.request.formData()
  const username = getString(formData, 'username')
  const password = getString(formData, 'password')
  const result = await signIn({ username, password })
  if (!result.success)
    return { issues: result.issues, values: { username, password } }
  return redirect('/', {
    headers: {
      'Set-Cookie': await initializeSession({ userId: result.userId }),
    },
  })
}

export async function loader(args: Route.LoaderArgs) {
  const session = await getSession(args.request)
  if (session) return redirect('/', { status: 303 })
}

export default function SignInPage({ actionData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams()
  const issues = actionData?.issues ?? new Map<string, string[]>()
  const values = actionData?.values
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center p-3">
      <Form
        method="POST"
        className="flex w-full max-w-sm flex-col gap-2 rounded bg-slate-200 px-5 py-3 dark:bg-slate-800"
      >
        <h1 className="py-2 text-center text-2xl">Sign In</h1>
        <FieldGroup>
          <Label htmlFor="signInUsername">Username</Label>
          <Input
            id="signInUsername"
            name="username"
            required
            invalid={issues.has('username')}
            defaultValue={values?.username}
          />
          <Issues issues={issues.get('username')} />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="signInPassword">Password</Label>
          <Input
            id="signInPassword"
            type="password"
            name="password"
            required
            invalid={issues.has('password')}
            defaultValue={values?.password}
          />
          <Issues issues={issues.get('password')} />
        </FieldGroup>
        <Button>Sign In</Button>
        <p>
          Need an account?{' '}
          <Link
            to={searchParams.size ? `/sign-up?${searchParams}` : '/sign-up'}
            className="underline"
          >
            Sign Up
          </Link>
        </p>
      </Form>
    </div>
  )
}
