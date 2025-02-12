import { Form, Link, redirect, useSearchParams } from 'react-router'
import { signUp, initializeSession, getSession } from '~/.server/auth'
import { FieldGroup, Label, Input, Issues } from '~/components/forms'
import { Button } from '~/components/button'
import { getString } from '~/utils/form-data'
import type { Route } from './+types/_auth.sign-up'

export async function action(args: Route.ActionArgs) {
  const formData = await args.request.formData()
  const username = getString(formData, 'username')
  const password = getString(formData, 'password')
  const result = await signUp({ username, password })
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

export default function SignUpPage({ actionData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams()
  const issues = actionData?.issues ?? new Map<string, string[]>()
  const values = actionData?.values
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Form
        method="POST"
        className="flex w-full max-w-sm flex-col gap-2 rounded bg-slate-200 px-5 py-3 dark:bg-slate-800"
      >
        <h1 className="py-2 text-center text-2xl">Sign Up</h1>
        <FieldGroup>
          <Label htmlFor="signUpUsername">Username</Label>
          <Input
            id="signUpUsername"
            name="username"
            required
            invalid={issues.has('username')}
            defaultValue={values?.username}
          />
          <Issues issues={issues.get('username')} />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="signUpPassword">Password</Label>
          <Input
            id="signUpPassword"
            type="password"
            name="password"
            invalid={issues.has('password')}
            defaultValue={values?.password}
            required
          />
          <Issues issues={issues.get('password')} />
        </FieldGroup>
        <Button>Sign Up</Button>
        <p>
          Already have an account?{' '}
          <Link
            to={searchParams.size ? `/sign-in?${searchParams}` : '/sign-in'}
            className="underline"
          >
            Sign In
          </Link>
        </p>
      </Form>
    </div>
  )
}
