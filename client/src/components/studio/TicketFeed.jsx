import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import StatusBadge from '../common/StatusBadge';

export default function TicketFeed() {
  const { tickets, activeTicketId, setActiveTicketId } = useTickets();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      if (catFilter !== 'All' && t.category !== catFilter) return false;
      if (statusFilter === 'Open' && t.status !== 'Open') return false;
      if (statusFilter === 'Pending' && t.status !== 'Pending Customer Info') return false;
      if (statusFilter === 'Resolved' && t.status !== 'Resolved') return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          t.customer.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.message.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tickets, catFilter, statusFilter, search]);

  return (
    <aside className="w-full md:w-80 lg:w-88 border-r border-[#E5E3DC] bg-[#FAF9F6] flex flex-col shrink-0">
      <div className="p-3 border-b border-[#E5E3DC] space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#5C5750] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-[#D3D1C8] focus:border-[#14110F] focus:outline-none text-xs text-[#14110F] placeholder-[#8A857D] pl-7 pr-3 py-1.5 rounded-[10px]"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto text-[11px] scrollbar-none">
          {['All', 'Returns & Refunds', 'Shipping & Delivery', 'Subscription & Billing'].map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`px-2 py-0.5 rounded-[10px] whitespace-nowrap cursor-pointer transition-colors ${
                catFilter === c
                  ? 'bg-[#14110F] text-white font-semibold'
                  : 'bg-white text-[#5C5750] hover:text-[#14110F] border border-[#D3D1C8]'
              }`}
            >
              {c === 'All' ? 'All' : c.split(' & ')[0]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-0.5 bg-[#EAE8E0] p-0.5 rounded-[8px] border border-[#D3D1C8] text-center text-[10px] font-mono">
          <button
            onClick={() => setStatusFilter('All')}
            className={`py-1 rounded-[6px] cursor-pointer transition-colors ${
              statusFilter === 'All' ? 'bg-white text-[#14110F] font-semibold shadow-xs' : 'text-[#5C5750]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('Open')}
            className={`py-1 rounded-[6px] cursor-pointer transition-colors ${
              statusFilter === 'Open' ? 'bg-white text-[#14110F] font-semibold shadow-xs' : 'text-[#5C5750]'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setStatusFilter('Pending')}
            className={`py-1 rounded-[6px] cursor-pointer transition-colors ${
              statusFilter === 'Pending' ? 'bg-white text-[#14110F] font-semibold shadow-xs' : 'text-[#5C5750]'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('Resolved')}
            className={`py-1 rounded-[6px] cursor-pointer transition-colors ${
              statusFilter === 'Resolved' ? 'bg-white text-[#14110F] font-semibold shadow-xs' : 'text-[#5C5750]'
            }`}
          >
            Outbox
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-[#EAE8E2]">
        {filteredTickets.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTicketId(t.id)}
            className={`w-full text-left p-3 text-xs transition-colors cursor-pointer ${
              t.id === activeTicketId ? 'bg-white border-l-4 border-l-[#14110F] shadow-xs' : 'hover:bg-white/70'
            }`}
          >
            <div className="flex justify-between font-mono mb-1">
              <span className="text-[#14110F] font-bold">{t.id}</span>
              <span className="text-[#5C5750] text-[10px]">{t.time}</span>
            </div>
            <div className="font-semibold text-[#14110F] truncate">
              {t.customer} — {t.subject}
            </div>
            <p className="text-[#5C5750] text-[11px] line-clamp-2 mt-1">{t.message}</p>
            <div className="flex justify-between items-center mt-2 text-[10px]">
              <span className="text-[#5C5750]">{t.category}</span>
              <StatusBadge status={t.status} />
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
