export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden aqua-gradient flex-col justify-between p-12 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-white" />
          <div className="absolute bottom-[-120px] right-[-60px] w-[500px] h-[500px] rounded-full bg-white" />
          <div className="absolute top-[40%] left-[30%] w-[200px] h-[200px] rounded-full bg-white" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight">AQUA HRMS</div>
            <div className="text-xs text-white/70">Human Resource Management</div>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Manage your workforce<br />
            <span className="text-white/80">smarter, faster, better.</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-md">
            AQUA HRMS brings all your HR operations under one roof — from hiring to payroll to performance, designed for modern teams.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { label: 'Employees Managed', value: '50K+' },
              { label: 'Enterprise Tenants', value: '1,200+' },
              { label: 'Uptime SLA', value: '99.9%' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features list */}
        <div className="relative z-10 space-y-3">
          {[
            'Multi-tenant SaaS architecture',
            'Role-based access control',
            'Real-time analytics & reporting',
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3 text-sm text-white/80">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                </svg>
              </div>
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl aqua-gradient flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="text-xl font-bold">AQUA HRMS</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
