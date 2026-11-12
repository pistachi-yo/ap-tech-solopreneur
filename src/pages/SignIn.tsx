import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { Header } from '@/components/landing/Header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth'

type Mode = 'sign-in' | 'sign-up'

// Only allow redirects back to a path inside this app.
function getReturnPath(state: unknown): string {
  const from = (state as { from?: unknown } | null)?.from
  return typeof from === 'string' && from.startsWith('/') ? from : '/projects'
}

export default function SignIn() {
  const { user, loading, signIn, signUp } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const returnPath = getReturnPath(location.state)

  const [mode, setMode] = useState<Mode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  if (!loading && user) {
    return <Navigate to={returnPath} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setNotice(null)
    try {
      if (mode === 'sign-in') {
        await signIn(email, password)
        navigate(returnPath, { replace: true })
      } else {
        const { needsConfirmation } = await signUp(email, password)
        if (needsConfirmation) {
          setNotice(
            'Check your email to confirm your account, then come back and sign in.',
          )
        } else {
          navigate(returnPath, { replace: true })
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const isSignIn = mode === 'sign-in'

  return (
    <div className="min-h-svh bg-chestnut-tertiary">
      <Header />
      <main className="mx-auto max-w-page px-3 py-8 sm:px-6">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle>{isSignIn ? 'Sign in' : 'Create an account'}</CardTitle>
            <CardDescription>
              {isSignIn
                ? 'Sign in to save bookmarks and track your progress.'
                : 'Create an account to save bookmarks and track your progress.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={isSignIn ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              {error && (
                <p role="alert" className="text-body-sm text-chestnut-primary">
                  {error}
                </p>
              )}
              {notice && (
                <p role="status" className="text-body-sm text-chestnut-900">
                  {notice}
                </p>
              )}

              <Button type="submit" disabled={submitting}>
                {submitting ? 'Please wait…' : isSignIn ? 'Sign in' : 'Sign up'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setMode(isSignIn ? 'sign-up' : 'sign-in')
                  setError(null)
                  setNotice(null)
                }}
              >
                {isSignIn
                  ? 'New here? Create an account'
                  : 'Already have an account? Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
