'use client'

import { createContext, useContext, useState } from 'react'
import type { AquaProductId } from './admin-data'

export type ProductFilter = AquaProductId | 'all'

interface AdminFilterCtxType {
  productFilter: ProductFilter
  setProductFilter: (p: ProductFilter) => void
}

const AdminFilterCtx = createContext<AdminFilterCtxType>({
  productFilter: 'all',
  setProductFilter: () => {},
})

export function AdminFilterProvider({ children }: { children: React.ReactNode }) {
  const [productFilter, setProductFilter] = useState<ProductFilter>('all')
  return (
    <AdminFilterCtx.Provider value={{ productFilter, setProductFilter }}>
      {children}
    </AdminFilterCtx.Provider>
  )
}

export function useAdminFilter() {
  return useContext(AdminFilterCtx)
}
