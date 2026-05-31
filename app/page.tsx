'use client'

import { Dashboard } from '@/components/dashboard'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { LoginForm } from '@/components/login-form'
import { useAuthStore } from '@/lib/store'

export default function Home() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  if (!isLoggedIn) {
    return <LoginForm />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}
