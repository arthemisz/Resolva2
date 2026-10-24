import React, { useState } from 'react';
import { useTickets } from '../../context/TicketContext';
import { POLICIES } from '../../data/policies';

export default function RightDrawer() {
  const { outbox, restoreTicket } = useTickets();
  const [drawerTab, setDrawerTab] = useState('knowledge');

  return (
    <aside className="w-full md:w-80 border-l border-[#E5E3DC] bg-[#FAF9F6] flex flex-col shrink-0 p-3 text-xs">
      <div className="flex bg-[#EAE8E0] p-0.5 rounded-[8px] border border-[#D3D1C8] mb-3 text-xs">
        <button
          onClick={() => setDrawerTab('knowledge')}
          className={`flex-1 py-1 rounded-[6px] cursor-pointer transition-colors ${
            drawerTab === 'knowledge' ? 'bg-white text-[#14110F] font-semibold shadow-xs' : 'text-[#5C5750]'
          }`}
        >
          Policy KB
        </button>
        <button
          onClick={() => setDrawerTab('outbox')}
          className={`flex-1 py-1 rounded-[6px] cursor-pointer transition-colors ${
            drawerTab === 'outbox' ? 'bg-white text-[#14110F] font-semibold shadow-xs' : 'text-[#5C5750]'
          }`}
        >
          Outbox ({outbox.length})
        </button>
      </div>

      {drawerTab === 'knowledge' ? (
        <div className="space-y-2.5 overflow-y-auto flex-1">
          {POLICIES.map(p => (
            <div key={p.id} className="p-3 rounded-[10px] bg-white border border-[#E5E3DC] space-y-1 shadow-xs">
              <div className="flex justify-between font-mono">
                <span className="font-bold text-[#14110F]">{p.id}</span>
                <span className="text-[#5C5750] text-[10px]">{p.category}</span>
              </div>
              <div className="font-semibold text-[#14110F]">{p.title}</div>
              <p className="text-[#5C5750] text-[11px] leading-relaxed">{p.summary}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2.5 overflow-y-auto flex-1">
          {outbox.length === 0 ? (
            <div className="p-8 text-center text-[#5C5750] bg-white rounded-[10px] border border-[#E5E3DC]">
              Outbox is empty. Approve tickets to view them here.
            </div>
          ) : (
            outbox.map(item => (
              <div key={item.id} className="p-3 rounded-[10px] bg-white border border-[#E5E3DC] space-y-1.5 shadow-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-[#14110F] font-bold">{item.id}</span>
                  <span className="text-[#5C5750] text-[10px]">{item.time}</span>
                </div>
                <div className="text-[#14110F] font-semibold">{item.customer}</div>
                <p className="p-2 bg-[#FAF9F6] rounded border border-[#E5E3DC] text-[#5C5750] font-mono text-[10px] max-h-24 overflow-y-auto whitespace-pre-wrap">
                  {item.draft}
                </p>
                <button
                  onClick={() => restoreTicket(item.id)}
                  className="text-[10px] text-[#0B7A50] hover:underline font-semibold cursor-pointer"
                >
                  Restore to Open
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </aside>
  );
}
