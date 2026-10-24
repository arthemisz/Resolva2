import React, { useState, useMemo } from 'react';
import { Search, RefreshCw, AlertTriangle, CheckCircle2, Package } from 'lucide-react';

export default function InventoryStockFeed({ products, loading, onRefresh, onSelectProduct }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const isLow = p.quantity < 10;
      if (filter === 'Low' && !isLow) return false;
      if (filter === 'Adequate' && isLow) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.unit.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, search, filter]);

  return (
    <aside className="w-full md:w-80 border-r border-[#E5E3DC] bg-[#FAF9F6] flex flex-col shrink-0">
      {/* Top Header & Search */}
      <div className="p-3 border-b border-[#E5E3DC] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#14110F]">
            <Package className="w-4 h-4 text-[#14110F]" />
            <span>Stock Inventory</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] bg-[#EAE8E0] text-[#14110F] px-1.5 py-0.5 rounded font-semibold border border-[#D3D1C8]">
              {products.length} SKUs
            </span>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-1 rounded-[6px] hover:bg-white text-[#5C5750] hover:text-[#14110F] border border-[#D3D1C8] transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh products"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#5C5750] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKU or name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-[#D3D1C8] focus:border-[#14110F] focus:outline-none text-xs text-[#14110F] placeholder-[#8A857D] pl-7 pr-3 py-1.5 rounded-[8px]"
          />
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-3 gap-1 bg-[#EAE8E0] p-0.5 rounded-[8px] border border-[#D3D1C8] text-center text-[10px] font-mono">
          {['All', 'Low', 'Adequate'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`py-1 rounded-[6px] cursor-pointer transition-colors ${
                filter === f
                  ? 'bg-white text-[#14110F] font-semibold shadow-xs'
                  : 'text-[#5C5750] hover:text-[#14110F]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#EAE8E2]">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#5C5750]">
            {loading ? 'Loading inventory data...' : 'No matching products found.'}
          </div>
        ) : (
          filteredProducts.map(p => {
            const isLow = p.quantity < 10;
            return (
              <div
                key={p.code}
                onClick={() => onSelectProduct && onSelectProduct(p)}
                className="p-3 text-xs hover:bg-white transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-white border border-[#D3D1C8] text-[#14110F] rounded font-semibold">
                    {p.code}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      isLow
                        ? 'bg-[#F6E3B0] text-[#78350F] border border-[#FDE68A]'
                        : 'bg-[#D5EEE2] text-[#065F46] border border-[#A7F3D0]'
                    }`}
                  >
                    {isLow ? (
                      <>
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>Low Stock</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Adequate</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="font-semibold text-sm text-[#14110F] group-hover:text-[#10A36B] transition-colors">
                  {p.name}
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-[#14110F]">{p.quantity}</span>
                    <span className="text-xs text-[#5C5750]">{p.unit}s available</span>
                  </div>
                </div>

                {/* Meter Bar */}
                <div className="mt-2 w-full bg-[#EAE8E2] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isLow ? 'bg-[#D97706]' : 'bg-[#10A36B]'
                    }`}
                    style={{ width: `${Math.min(100, (p.quantity / 30) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
