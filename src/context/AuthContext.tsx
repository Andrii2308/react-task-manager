import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"
import { getFirebaseAuth } from "../lib/firebase"

type AuthContextValue = {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getFirebaseAuth()
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async signInWithGoogle() {
        const auth = getFirebaseAuth()
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider)
      },
      async signInWithEmail(email, password) {
        const auth = getFirebaseAuth()
        await signInWithEmailAndPassword(auth, email.trim(), password)
      },
      async signUpWithEmail(email, password) {
        const auth = getFirebaseAuth()
        await createUserWithEmailAndPassword(auth, email.trim(), password)
      },
      async signOut() {
        const auth = getFirebaseAuth()
        await firebaseSignOut(auth)
      },
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}
