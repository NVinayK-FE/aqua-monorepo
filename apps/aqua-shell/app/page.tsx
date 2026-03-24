import { redirect } from 'next/navigation'

export default function HomePage() {
  // In production: check session/auth cookie and redirect appropriately
  redirect('/login')
}
