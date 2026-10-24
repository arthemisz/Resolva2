import React, { useState } from 'react';
import { Terminal, ArrowDown } from 'lucide-react';
import { INITIAL_TICKETS } from '../../data/tickets';
import { POLICIES } from '../../data/policies';
import { useTickets } from '../../context/TicketContext';
import { scrollToSection } from '../../utils/scroll';

export default function BenchmarkSection() {
  const [benchmarkIdx, setBenchmarkIdx] = useState(0);
  const { setActiveTicketId } = useTickets();

  const currentTicket = INITIAL_TICKETS[benchmarkIdx];
  const matchedPolicy = POLICIES.find(p => p.id === currentTicket.policyId);

  const handleOpenInStudio = () => {
    setActiveTicketId(currentTicket.id);
    scrollToSection('studio');
  };

  return (
    <section id="benchmark" className="py-14 px-4 sm:px-8 max-w-5xl mx-auto w-full border-t border-[#E5E3DC]">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
        <div>
          <span className="text-xs font-mono uppercase text-[#5C5750] font-semibold">Live Sandbox</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#14110F]">Interactive Resolution Benchmark</h2>
          <p className="text-xs sm:text-sm text-[#5C5750] mt-1">
            Compare incoming customer claims against exact policy terms and view deterministic drafts before opening in studio.
          </p>
        </div>
      </div>

      <div className="rounded-[10px] bg-white border border-[#E5E3DC] shadow-sm overflow-hidden text-left">
        <div className="p-3 bg-[#FAF9F6] border-b border-[#E5E3DC] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#5C5750] font-mono">
            <Terminal className="w-3.5 h-3.5 text-[#14110F]" />
            <span>resolution_benchmark.copilot</span>
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {INITIAL_TICKETS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setBenchmarkIdx(idx)}
                className={`px-2.5 py-1 rounded-[6px] font-mono text-xs transition-colors cursor-pointer ${
                  benchmarkIdx === idx
                    ? 'bg-[#14110F] text-white font-semibold'
                    : 'text-[#5C5750] hover:text-[#14110F] bg-white border border-[#E5E3DC]'
                }`}
              >
                {t.id} {t.category.split(' & ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
          <div className="md:col-span-5 space-y-3">
            <div className="p-3.5 rounded-[10px] bg-[#FAF9F6] border border-[#E5E3DC] space-y-1.5">
              <div className="flex justify-between font-mono text-[#5C5750] text-[11px]">
                <span>Inbound Customer Message</span>
                <span className="text-[#14110F] font-bold">{currentTicket.id}</span>
              </div>
              <div className="font-semibold text-[#14110F]">{currentTicket.customer}</div>
              <p className="text-[#5C5750] leading-relaxed font-sans">"{currentTicket.message}"</p>
            </div>

            <div className="p-3.5 rounded-[10px] bg-[#FAF9F6] border border-[#E5E3DC] space-y-1">
              <div className="flex justify-between font-mono text-[#5C5750] text-[11px]">
                <span>Enforced Policy</span>
                <span className="bg-[#F1F0EA] px-1.5 py-0.5 rounded text-[#14110F] border border-[#D3D1C8] font-bold">
                  {currentTicket.policyId}
                </span>
              </div>
              <p className="text-[#5C5750]">{matchedPolicy?.summary}</p>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col justify-between p-3.5 rounded-[10px] bg-[#FAF9F6] border border-[#E5E3DC] space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-2">
                <span className="font-semibold text-[#14110F]">Verified Draft Proposal</span>
                <span className="font-mono text-[10px] text-[#0B7A50] font-semibold">Zero Hallucinations</span>
              </div>
              <div className="p-3 bg-white border border-[#E5E3DC] rounded-[8px] text-[#14110F] whitespace-pre-wrap font-sans leading-relaxed shadow-xs">
                {currentTicket.draft}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E5E3DC] flex items-center justify-between">
              <span className="text-[#5C5750] font-mono text-[11px]">Audit: Ready for officer approval</span>
              <button
                onClick={handleOpenInStudio}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] bg-[#14110F] text-white font-semibold text-xs hover:bg-black transition-colors cursor-pointer shadow-xs group"
              >
                <span>Open in Studio Below</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#10A36B] group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
