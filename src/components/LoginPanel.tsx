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
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupOpen, setSignupOpen] = useState(false)
  const [signupError, setSignupError] = useState<string | null>(null)
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

  const openSignup = () => {
    setSignupError(null)
    setSignupEmail(email)
    setSignupPassword(password)
    setSignupOpen(true)
  }

  const handleSignUp = async () => {
    setSignupError(null)
    if (!signupEmail.trim() || !signupPassword) {
      setSignupError("Enter email and password.")
      return
    }
    setBusy(true)
    try {
      await signUpWithEmail(signupEmail, signupPassword)
      setSignupOpen(false)
    } catch (e) {
      setSignupError(authMessage(e))
      setBusy(false)
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
        <button type="button" onClick={openSignup} disabled={busy}>
          Create account
        </button>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {signupOpen && (
        <div
          className="schedule-modal-backdrop"
          role="presentation"
          onClick={() => setSignupOpen(false)}
        >
          <div
            className="schedule-modal auth-signup-modal"
            role="dialog"
            aria-labelledby="signup-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="signup-modal-title" className="schedule-modal-title">
              Create account
            </h2>
            <p className="schedule-modal-hint">
              Enter your email and password to register.
            </p>
            <label className="schedule-modal-label">
              Email
              <input
                type="email"
                className="auth-modal-input"
                autoComplete="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                disabled={busy}
              />
            </label>
            <label className="schedule-modal-label">
              Password
              <input
                type="password"
                className="auth-modal-input"
                autoComplete="new-password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                disabled={busy}
              />
            </label>
            {signupError && <p className="auth-error">{signupError}</p>}
            <div className="schedule-modal-actions">
              <button type="button" onClick={() => setSignupOpen(false)} disabled={busy}>
                Cancel
              </button>
              <button type="button" onClick={handleSignUp} disabled={busy}>
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginPanel
