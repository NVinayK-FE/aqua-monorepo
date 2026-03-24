'use client'

import { useState } from 'react'
import { BarChart2, Table2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChartTableToggleProps {
  defaultView?: 'chart' | 'table'
  onViewChange?: (view: 'chart' | 'table') => void
  chartContent: React.ReactNode
  tableContent: React.ReactNode
  className?: string
}

export function ChartTableToggle({
  defaultView = 'chart',
  onViewChange,
  chartContent,
  tableContent,
  className,
}: ChartTableToggleProps) {
  const [view, setView] = useState<'chart' | 'table'>(defaultView)

  const handleChange = (v: 'chart' | 'table') => {
    setView(v)
    onViewChange?.(v)
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Toggle buttons */}
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            type="button"
            onClick={() => handleChange('chart')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              view === 'chart'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Chart
          </button>
          <button
            type="button"
            onClick={() => handleChange('table')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              view === 'table'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Table2 className="w-3.5 h-3.5" />
            Table
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {view === 'chart' ? chartContent : tableContent}
      </div>
    </div>
  )
}
