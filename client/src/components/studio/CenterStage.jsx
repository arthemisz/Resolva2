import React from 'react';
import { Copy, Send } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';

export default function CenterStage() {
  const {
    activeTicket,
    activePolicy,
    draft,
    setDraft,
    setTickets,
    showToast,
    toggleMissingField,
    isScanning,
    runScan,
    generateDraft,
    approveAndOutbox
  } = useTickets();

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto p-4 sm:p-5 space-y-4">
      {/* Ticket Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E3DC] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold bg-[#F1F0EA] text-[#14110F] px-1.5 py-0.5 rounded-[6px] border border-[#D3D1C8]">
              {activeTicket.id}
            </span>
            <h3 className="text-base font-semibold text-[#14110F]">{activeTicket.subject}</h3>
          </div>
          <div className="text-xs text-[#5C5750] mt-1 font-mono">
            {activeTicket.customer} ({activeTicket.email}) • {activeTicket.time}
          </div>
        </div>

        <select
          value={activeTicket.status}
          onChange={e => {
            const s = e.target.value;
            setTickets(prev => prev.map(t => (t.id === activeTicket.id ? { ...t, status: s } : t)));
            showToast(`Status updated: ${s}`);
          }}
          className="bg-white border border-[#D3D1C8] text-xs text-[#14110F] rounded-[8px] px-2.5 py-1.5 focus:outline-none focus:border-[#14110F] shadow-xs cursor-pointer"
        >
          <option value="Open">Open</option>
          <option value="Pending Customer Info">Pending Customer Info</option>
          <option value="Resolved">Resolved / In Outbox</option>
        </select>
      </div>

      {/* Inbound Statement */}
      <div className="p-3.5 rounded-[10px] bg-[#FAF9F6] border border-[#E5E3DC] space-y-1.5 text-xs">
        <div className="flex justify-between text-[#5C5750] font-mono text-[11px]">
          <span>Inbound Statement</span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(activeTicket.message);
              showToast('Copied message');
            }}
            className="hover:text-[#14110F] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Copy className="w-3 h-3" />
            <span>Copy</span>
          </button>
        </div>
        <p className="text-[#14110F] leading-relaxed font-sans select-text">"{activeTicket.message}"</p>
      </div>

      {/* Copilot Execution Pipeline */}
      <div className="p-4 rounded-[10px] bg-[#FAF9F6] border border-[#E5E3DC] space-y-3.5 text-xs">
        <div className="flex justify-between items-center border-b border-[#E5E3DC] pb-2">
          <span className="font-mono font-semibold text-[#14110F] uppercase tracking-wider text-[11px]">
            Copilot Pipeline
          </span>
          <span className="font-mono text-[11px] text-[#0B7A50] font-semibold">
            {activeTicket.confidence}% confidence
          </span>
        </div>

        {/* Step 1 & 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded-[8px] border border-[#E5E3DC] space-y-1 shadow-xs">
            <div className="text-[#5C5750] font-mono text-[10px] font-semibold">01 Intent Detected</div>
            <p className="text-[#14110F]">{activeTicket.intent}</p>
          </div>
          <div className="p-3 bg-white rounded-[8px] border border-[#E5E3DC] space-y-1 shadow-xs">
            <div className="flex justify-between text-[#5C5750] font-mono text-[10px] font-semibold">
              <span>02 Policy Match</span>
              <span className="text-[#14110F] bg-[#F1F0EA] px-1.5 py-0.2 rounded border border-[#D3D1C8]">
                {activePolicy.id}
              </span>
            </div>
            <p className="text-[#14110F]">{activePolicy.title}</p>
          </div>
        </div>

        {/* Step 3: Missing Fields Checklist */}
        <div className="p-3 bg-white rounded-[8px] border border-[#E5E3DC] space-y-2 shadow-xs">
          <div className="text-[#5C5750] font-mono text-[10px] font-semibold">
            03 Missing Parameters Check (Click to toggle)
          </div>
          <div className="space-y-1.5">
            {activeTicket.missing.map((f, i) => (
              <div
                key={i}
                onClick={() => toggleMissingField(i)}
                className="flex items-center justify-between p-2 rounded-[6px] bg-[#FAF9F6] border border-[#E5E3DC] cursor-pointer text-xs hover:border-[#D3D1C8] transition-colors"
              >
                <span className={f.ok ? 'line-through text-[#5C5750]' : 'text-[#14110F] font-medium'}>{f.name}</span>
                <span
                  className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    f.ok
                      ? 'bg-[#D5EEE2] text-[#0B5A3A] border border-[#BCE1D1]'
                      : 'bg-[#F6E3B0] text-[#5A3F00] border border-[#EED492]'
                  }`}
                >
                  {f.ok ? 'Verified' : 'Missing'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 4: Editable Draft */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#5C5750] font-mono font-semibold">04 Response Draft</span>
            <div className="flex gap-2">
              <button
                onClick={() => setDraft(prev => prev + ` [${activePolicy.id}]`)}
                className="text-[#5C5750] hover:text-[#14110F] font-mono cursor-pointer transition-colors"
              >
                + [{activePolicy.id}]
              </button>
            </div>
          </div>
          <textarea
            rows={6}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            className="w-full bg-white border border-[#D3D1C8] focus:border-[#10A36B] focus:ring-1 focus:ring-[#10A36B] focus:outline-none rounded-[8px] p-3 text-xs text-[#14110F] leading-relaxed resize-y font-sans shadow-xs"
          />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-[#E5E3DC] p-3 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={runScan}
            disabled={isScanning}
            className="px-3 py-1.5 rounded-[10px] bg-white border border-[#D3D1C8] hover:bg-[#FAF9F6] text-xs text-[#14110F] font-medium cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
          >
            {isScanning ? 'Scanning...' : 'Run Scan'}
          </button>
          <button
            onClick={generateDraft}
            className="px-3 py-1.5 rounded-[10px] bg-white border border-[#D3D1C8] hover:bg-[#FAF9F6] text-xs text-[#14110F] font-medium cursor-pointer transition-colors shadow-xs"
          >
            Generate Draft
          </button>
        </div>

        <button
          onClick={approveAndOutbox}
          className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#10A36B] text-white text-xs font-semibold hover:bg-[#0B7A50] transition-colors cursor-pointer shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Approve & Move to Outbox</span>
        </button>
      </div>
    </main>
  );
}
