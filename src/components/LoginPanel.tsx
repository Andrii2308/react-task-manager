import { useState } from "react"
import { FirebaseError } from "firebase/app"
import { useAuth } from "../context/AuthContext"

function authMessage(e: unknown): string {
  const code = e instanceof FirebaseError ? e.code : String(e)
  if (code.includes("invalid-credential")) return "Invalid email or password."
  if (code.includes("wrong-password")) return "Wrong password."
  if (code.includes("user-not-found")) return "No account for this email."
  if (code.includes("email-already-in-use")) return "This email is already registered."
  if (code.includes("weak-password")) return "Password should be at least 6 characters."
  if (code.includes("invalid-email")) return "Invalid email address."
  if (code.includes("popup-closed-by-user")) return "Sign-in popup was closed."
  if (code.includes("network-request-failed")) return "Network error. Try again."
  return "Something went wrong. Try again."
}

function LoginPanel() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onError = (e: unknown) => {
    setError(authMessage(e))
    setBusy(false)
  }

  const handleSignIn = async () => {
    setError(null)
    if (!email.trim() || !password) {
      setError("Enter email and password.")
      return
    }
    setBusy(true)
    try {
      await signInWithEmail(email, password)
    } catch (e) {
      onError(e)
    }
  }

  const handleSignUp = async () => {
    setError(null)
    if (!email.trim() || !password) {
      setError("Enter email and password.")
      return
    }
    setBusy(true)
    try {
      await signUpWithEmail(email, password)
    } catch (e) {
      onError(e)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    setBusy(true)
    try {
      await signInWithGoogle()
    } catch (e) {
      onError(e)
    }
  }

  return (
    <div className="auth-panel">
      <h1 className="auth-title">Task Manager</h1>
      <p className="auth-sub">Sign in to sync your tasks</p>

      <button
        type="button"
        className="auth-google"
        onClick={handleGoogle}
        disabled={busy}
      >
        Continue with Google
      </button>

      <div className="auth-divider">
        <span>or email</span>
      </div>

      <label className="auth-label">
        Email
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
        />
      </label>
      <label className="auth-label">
        Password
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={busy}
        />
      </label>

      <div className="auth-actions">
        <button type="button" onClick={handleSignIn} disabled={busy}>
          Sign in
        </button>
        <button type="button" onClick={handleSignUp} disabled={busy}>
          Create account
        </button>
      </div>

      {error && <p className="auth-error">{error}</p>}
    </div>
  )
}

export default LoginPanel
