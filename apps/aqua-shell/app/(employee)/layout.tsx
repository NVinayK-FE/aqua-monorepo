import { EmployeeSidebar } from '@/components/layout/employee-sidebar'

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <EmployeeSidebar />
      <main className="flex-1 overflow-hidden flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  )
}
