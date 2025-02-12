import { signOut } from '~/.server/auth'
import type { Route } from './+types/_auth.sign-out'

export async function action(args: Route.ActionArgs) {
  return signOut(args.request)
}
