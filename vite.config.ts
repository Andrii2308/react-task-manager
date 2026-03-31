import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function getPagesBasePath(): string {
  if (!process.env.GITHUB_ACTIONS) return '/'
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
  if (!repo) return '/'
  // User/organization pages repository should stay at root.
  if (repo.endsWith('.github.io')) return '/'
  return `/${repo}/`
}

// https://vite.dev/config/
export default defineConfig({
  base: getPagesBasePath(),
  plugins: [react()],
})
