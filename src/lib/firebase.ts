import { initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

function required(key: string, value: string | undefined): string {
  const v = value?.trim()
  if (!v) {
    throw new Error(
      `Missing ${key} in .env — add Firebase web app config from the Firebase console.`
    )
  }
  return v
}

let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp({
      apiKey: required("VITE_FIREBASE_API_KEY", import.meta.env.VITE_FIREBASE_API_KEY),
      authDomain: required(
        "VITE_FIREBASE_AUTH_DOMAIN",
        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
      ),
      projectId: required(
        "VITE_FIREBASE_PROJECT_ID",
        import.meta.env.VITE_FIREBASE_PROJECT_ID
      ),
      storageBucket: required(
        "VITE_FIREBASE_STORAGE_BUCKET",
        import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
      ),
      messagingSenderId: required(
        "VITE_FIREBASE_MESSAGING_SENDER_ID",
        import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
      ),
      appId: required("VITE_FIREBASE_APP_ID", import.meta.env.VITE_FIREBASE_APP_ID),
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    })
  }
  return app
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp())
  }
  return auth
}

export function getFirestoreDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp())
  }
  return db
}
