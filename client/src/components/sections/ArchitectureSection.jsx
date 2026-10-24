import React from 'react';
import { ShieldCheck, SlidersHorizontal, CheckCheck } from 'lucide-react';

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full border-t border-[#E5E3DC]">
      <div className="mb-10 text-left">
        <span className="text-xs font-mono uppercase tracking-wider text-[#5C5750] block mb-1">Architecture</span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14110F]">
          One finished job: resolve the ticket.
        </h2>
        <p className="text-[#5C5750] text-sm mt-1">
          Botpress provides horizontal agent plumbing. Resolva is the finished enterprise officer: pre-trained to read company terms and close support cases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-[10px] bg-white border border-[#E5E3DC] shadow-sm space-y-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-[#FAF9F6] border border-[#E5E3DC] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#14110F]" />
          </div>
          <h3 className="text-sm font-semibold text-[#14110F]">Deterministic Citations</h3>
          <p className="text-[#5C5750] leading-relaxed">
            Resolva checks claims strictly against your policies (such as POL-REF-01) instead of making loose promises.
          </p>
        </div>

        <div className="p-5 rounded-[10px] bg-white border border-[#E5E3DC] shadow-sm space-y-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-[#FAF9F6] border border-[#E5E3DC] flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-[#14110F]" />
          </div>
          <h3 className="text-sm font-semibold text-[#14110F]">Missing Info Detection</h3>
          <p className="text-[#5C5750] leading-relaxed">
            Detects unverified receipts, delivery checks, or purchase dates before proposing a final draft.
          </p>
        </div>

        <div className="p-5 rounded-[10px] bg-white border border-[#E5E3DC] shadow-sm space-y-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-[#FAF9F6] border border-[#E5E3DC] flex items-center justify-center">
            <CheckCheck className="w-4 h-4 text-[#10A36B]" />
          </div>
          <h3 className="text-sm font-semibold text-[#14110F]">Human-in-the-Loop Studio</h3>
          <p className="text-[#5C5750] leading-relaxed">
            Officers review, adjust tone, and approve drafts with one click straight into the dispatch outbox.
          </p>
        </div>
      </div>
    </section>
  );
}
