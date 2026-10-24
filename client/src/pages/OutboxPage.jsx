import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive, ArrowRight, RotateCcw } from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export default function OutboxPage() {
  const { outbox, restoreTicket } = useTickets();
  const navigate = useNavigate();

  return (
    <div className="py-12 px-4 sm:px-8 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#5C5750] block mb-1">
            Queue & Dispatch
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14110F]">
            Internal Outbox Archive
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5750] mt-1">
            Review approved resolution drafts staged for customer email delivery or restore to open tickets.
          </p>
        </div>
        <span className="font-mono text-xs text-[#5C5750] font-semibold bg-[#F1F0EA] px-2.5 py-1 rounded-[6px] border border-[#D3D1C8]">
          {outbox.length} approved records
        </span>
      </div>

      {outbox.length === 0 ? (
        <div className="p-12 rounded-[10px] bg-[#FAF9F6] border border-[#E5E3DC] text-center text-xs text-[#5C5750] space-y-3">
          <Archive className="w-8 h-8 mx-auto text-[#8A857D]" />
          <h3 className="text-base font-semibold text-[#14110F]">No tickets in outbox yet</h3>
          <p className="max-w-md mx-auto text-[#5C5750]">
            Tickets approved by support officers in the AI Resolution Studio are safely saved and queued here.
          </p>
          <button
            onClick={() => navigate('/studio')}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#14110F] text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
          >
            <span>Open Studio to Approve Tickets</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#10A36B]" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {outbox.map(item => (
            <div key={item.id} className="p-5 rounded-[10px] bg-white border border-[#E5E3DC] shadow-sm space-y-3">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="font-bold text-[#14110F] bg-[#F1F0EA] px-1.5 py-0.2 rounded border border-[#D3D1C8]">
                  {item.id}
                </span>
                <span className="text-[#5C5750]">{item.time}</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#14110F]">{item.customer}</h3>
                <span className="text-xs text-[#5C5750]">{item.subject}</span>
              </div>
              <p className="p-3 bg-[#FAF9F6] rounded-[8px] border border-[#E5E3DC] text-[#14110F] font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {item.draft}
              </p>
              <div className="flex justify-between items-center pt-1 text-[11px]">
                <span className="font-mono text-[#0B7A50] font-semibold">{item.policyId} Verified</span>
                <button
                  onClick={() => restoreTicket(item.id)}
                  className="flex items-center gap-1 text-[#5C5750] hover:text-[#14110F] cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore to Open Queue</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
