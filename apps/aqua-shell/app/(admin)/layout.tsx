import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { AdminFilterProvider } from '@/lib/admin-filter-context'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminFilterProvider>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-hidden flex flex-col min-h-screen">
          {children}
        </main>
      </div>
    </AdminFilterProvider>
  )
}
