'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function NavBar() {
  const pathname = usePathname()

  async function handleSignOut() {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {
      // sign-out error — proceed with redirect anyway
    } finally {
      window.location.href = '/login'
    }
  }

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname === href ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
    }`

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-bold text-lg text-gray-900">CRM</span>
          <Link href="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
          <Link href="/clientes" className={linkClass('/clientes')}>Clientes</Link>
          <Link href="/pipeline" className={linkClass('/pipeline')}>Pipeline</Link>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Sair
        </button>
      </div>
    </nav>
  )
}
