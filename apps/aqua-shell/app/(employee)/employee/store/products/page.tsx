'use client';

import { useState } from 'react';
import { Search, Grid3x3, List, Plus, MoreVertical, Package, Watch, Shirt, Home, Book } from 'lucide-react';

// Mock product data
const PRODUCTS_DATA = [
  // Electronics
  { id: 1, name: 'Aqua Desk Stand Pro', sku: 'ADS-001', category: 'Electronics', price: 89.00, stock: 4, status: 'Low Stock', sales: 12, image: '🖥️' },
  { id: 2, name: 'USB-C Hub 7-port', sku: 'USB-002', category: 'Electronics', price: 45.00, stock: 7, status: 'Low Stock', sales: 18, image: '🔌' },
  { id: 3, name: 'Wireless Charger Pad', sku: 'WCP-003', category: 'Electronics', price: 35.00, stock: 2, status: 'Low Stock', sales: 24, image: '⚡' },
  { id: 4, name: 'Laptop Stand Aluminum', sku: 'LSA-004', category: 'Electronics', price: 120.00, stock: 38, status: 'In Stock', sales: 35, image: '📱' },
  { id: 5, name: 'Mechanical Keyboard', sku: 'MKB-005', category: 'Electronics', price: 195.00, stock: 22, status: 'In Stock', sales: 28, image: '⌨️' },
  { id: 6, name: '4K Webcam Pro', sku: 'WEB-006', category: 'Electronics', price: 149.00, stock: 15, status: 'In Stock', sales: 19, image: '📷' },
  // Accessories
  { id: 7, name: 'Cable Management Kit', sku: 'CMK-007', category: 'Accessories', price: 28.00, stock: 0, status: 'Out of Stock', sales: 8, image: '🎀' },
  { id: 8, name: 'Ergonomic Mouse Pad', sku: 'EMP-008', category: 'Accessories', price: 22.00, stock: 54, status: 'In Stock', sales: 42, image: '🖱️' },
  { id: 9, name: 'Monitor Light Bar', sku: 'MLB-009', category: 'Accessories', price: 65.00, stock: 11, status: 'In Stock', sales: 16, image: '💡' },
  { id: 10, name: 'Desk Organizer Pro', sku: 'DOP-010', category: 'Accessories', price: 42.00, stock: 29, status: 'In Stock', sales: 21, image: '📦' },
  // Apparel
  { id: 11, name: 'Aqua Branded Hoodie', sku: 'ABH-011', category: 'Apparel', price: 55.00, stock: 0, status: 'Out of Stock', sales: 31, image: '👕' },
  { id: 12, name: 'Tech Polo Shirt', sku: 'TPS-012', category: 'Apparel', price: 35.00, stock: 44, status: 'In Stock', sales: 26, image: '👔' },
  { id: 13, name: 'Baseball Cap', sku: 'BBC-013', category: 'Apparel', price: 25.00, stock: 67, status: 'In Stock', sales: 38, image: '🧢' },
  // Home
  { id: 14, name: 'Bamboo Desk Mat', sku: 'BDM-014', category: 'Home', price: 38.00, stock: 31, status: 'In Stock', sales: 15, image: '🪴' },
  { id: 15, name: 'Air Purifier Mini', sku: 'APM-015', category: 'Home', price: 89.00, stock: 9, status: 'In Stock', sales: 11, image: '💨' },
  { id: 16, name: 'LED Desk Lamp', sku: 'LDL-016', category: 'Home', price: 72.00, stock: 18, status: 'In Stock', sales: 22, image: '🕯️' },
  // Books
  { id: 17, name: 'The Lean Startup', sku: 'TLS-017', category: 'Books', price: 19.00, stock: 0, status: 'Out of Stock', sales: 9, image: '📚' },
  { id: 18, name: 'Atomic Habits', sku: 'AH-018', category: 'Books', price: 16.00, stock: 82, status: 'In Stock', sales: 51, image: '📖' },
  { id: 19, name: 'Deep Work', sku: 'DW-019', category: 'Books', price: 18.00, stock: 55, status: 'In Stock', sales: 33, image: '📕' },
  { id: 20, name: 'Zero to One', sku: 'ZO-020', category: 'Books', price: 17.00, stock: 44, status: 'In Stock', sales: 27, image: '📗' },
];

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Apparel', 'Home', 'Books'];

const getCategoryIcon = (category: string) => {
  switch(category) {
    case 'Electronics': return <Package size={20} />;
    case 'Accessories': return <Watch size={20} />;
    case 'Apparel': return <Shirt size={20} />;
    case 'Home': return <Home size={20} />;
    case 'Books': return <Book size={20} />;
    default: return <Package size={20} />;
  }
};

const getCategoryColor = (category: string) => {
  switch(category) {
    case 'Electronics': return '#3B82F6';
    case 'Accessories': return '#8B5CF6';
    case 'Apparel': return '#EC4899';
    case 'Home': return '#10B981';
    case 'Books': return '#F59E0B';
    default: return '#6B7280';
  }
};

const getStockStatus = (stock: number) => {
  if (stock === 0) return { label: 'Out of Stock', color: '#DC2626', bgColor: '#FEE2E2' };
  if (stock < 10) return { label: `Low Stock (${stock})`, color: '#D97706', bgColor: '#FEF3C7' };
  return { label: `In Stock (${stock})`, color: '#059669', bgColor: '#D1FAE5' };
};

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = PRODUCTS_DATA.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = {
    total: PRODUCTS_DATA.length,
    active: PRODUCTS_DATA.filter(p => p.stock > 0).length,
    lowStock: PRODUCTS_DATA.filter(p => p.stock > 0 && p.stock < 10).length,
    outOfStock: PRODUCTS_DATA.filter(p => p.stock === 0).length,
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border bg-white">
        <h1 className="text-xl font-bold text-foreground">Products</h1>
      </div>

      {/* KPI Cards */}
      <div className="px-8 pt-8 pb-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="stat-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Products</p>
            <p className="text-2xl font-bold text-foreground mt-2">{stats.total}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active</p>
            <p className="text-2xl font-bold text-foreground mt-2">{stats.active}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Low Stock</p>
            <p className="text-2xl font-bold text-foreground mt-2">{stats.lowStock}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Out of Stock</p>
            <p className="text-2xl font-bold text-foreground mt-2">{stats.outOfStock}</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
                <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg border transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-amber-50 border-amber-300 text-amber-600'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg border transition-colors ${
                  viewMode === 'table'
                    ? 'bg-amber-50 border-amber-300 text-amber-600'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <List size={18} />
              </button>
            </div>

            <button style={{ backgroundColor: '#f59e0b' }} className="text-white px-4 py-2 rounded-xl shadow-sm hover:opacity-90 flex items-center gap-2 font-medium text-sm">
              <Plus size={16} />
              Add Product
            </button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-4 gap-4">
            {filteredProducts.map(product => {
              const stockStatus = getStockStatus(product.stock);
              const categoryColor = getCategoryColor(product.category);
              return (
                <div key={product.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
                  {/* Product Image */}
                  <div className="relative w-full h-24 rounded-xl mb-3 flex items-center justify-center text-4xl" style={{ backgroundColor: categoryColor + '20' }}>
                    {product.image}
                    <button className="absolute top-2 right-2 p-1 bg-white rounded-lg border border-border hover:bg-gray-50 shadow-sm">
                      <MoreVertical size={14} className="text-muted-foreground" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <h3 className="font-semibold text-sm text-foreground mb-1">{product.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono mb-3">{product.sku}</p>

                  {/* Price */}
                  <p className="text-lg font-bold text-amber-600 mb-3">${product.price.toFixed(2)}</p>

                  {/* Stock Status */}
                  <div className="mb-3 p-2 rounded-lg" style={{ backgroundColor: stockStatus.bgColor }}>
                    <p className="text-xs font-semibold" style={{ color: stockStatus.color }}>
                      {stockStatus.label}
                    </p>
                  </div>

                  {/* Category Pill */}
                  <div className="flex items-center gap-2 p-2 rounded-lg text-white text-xs font-medium w-fit" style={{ backgroundColor: categoryColor }}>
                    {getCategoryIcon(product.category)}
                    {product.category}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <table className="w-full data-table">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-foreground">Price</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-foreground">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-foreground">Sales</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map(product => {
                  const stockStatus = getStockStatus(product.stock);
                  const categoryColor = getCategoryColor(product.category);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: categoryColor + '20' }}>
                            {product.image}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground w-fit p-2 rounded-lg" style={{ backgroundColor: categoryColor + '20', color: categoryColor }}>
                          {getCategoryIcon(product.category)}
                          {product.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-foreground">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center text-sm font-medium text-foreground">{product.stock}</td>
                      <td className="px-6 py-4">
                        <div className="p-2 rounded-lg w-fit" style={{ backgroundColor: stockStatus.bgColor }}>
                          <p className="text-xs font-semibold" style={{ color: stockStatus.color }}>
                            {stockStatus.label}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-medium text-foreground">{product.sales}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-amber-600 hover:text-amber-700 p-1">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .stat-card {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .data-table tbody tr {
          border-color: #e5e7eb;
        }
      `}</style>
    </div>
  );
}
