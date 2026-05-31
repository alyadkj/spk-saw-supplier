'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { PenilaianForm } from '@/components/penilaian-form'
import { LoginForm } from '@/components/login-form'
import { useAuthStore } from '@/lib/store'

export default function PenilaianPage() {
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
          <PenilaianForm />
        </main>
      </div>
    </div>
  )
}
