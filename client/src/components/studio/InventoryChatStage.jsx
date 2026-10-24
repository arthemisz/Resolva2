import React, { useRef, useEffect } from 'react';
import { Send, Sparkles, AlertTriangle, CheckCircle2, Bot, User, Check, X, Loader2, Trash2 } from 'lucide-react';

const formatQuantity = (quantity, unit) => {
  if (quantity === 1 || unit.endsWith('s')) return `${quantity} ${unit}`;
  if (/(x|ch|sh|z)$/.test(unit)) return `${quantity} ${unit}es`;
  if (/[^aeiou]y$/.test(unit)) return `${quantity} ${unit.slice(0, -1)}ies`;
  return `${quantity} ${unit}s`;
};

export default function InventoryChatStage({
  messages,
  input,
  setInput,
  loading,
  pendingProposal,
  onCancelProposal,
  onClearChat,
  onSendMessage,
  onConfirmProposal
}) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingProposal, loading]);

  const quickPrompts = [
    'Sell 2 bags of Golden Flour',
    'Delivered 10 PureDrop Water',
    'Return 1 bottle SunFresh Cooking Oil',
    'Check stock for SoftCare Soap'
  ];

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-white">
      {/* Copilot Header */}
      <div className="p-3.5 border-b border-[#E5E3DC] bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[6px] bg-[#14110F] flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5 text-[#10A36B]" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#14110F]">Autonomous Inventory Copilot</h3>
            <span className="text-[10px] text-[#5C5750] font-mono">gemini-3.5-flash-lite • tool calling enabled</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D5EEE2] border border-[#BCE1D1] text-[10px] font-mono text-[#0B5A3A] font-semibold">
            <span>MongoDB Atlas Live</span>
          </div>
          <button
            type="button"
            onClick={onClearChat}
            disabled={loading}
            className="flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-white hover:bg-[#F1F0EA] border border-[#D3D1C8] text-[10px] font-medium text-[#5C5750] hover:text-[#14110F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Clear conversation and pending proposal"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear chat</span>
          </button>
        </div>
      </div>

      {/* Quick Suggestions Strip */}
      <div className="px-3.5 py-1.5 bg-[#FAF9F6]/50 border-b border-[#EAE8E2] flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
        <span className="text-[#8A857D] font-mono text-[10px] uppercase shrink-0">Try:</span>
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => setInput(q)}
            className="px-2 py-0.5 rounded-[6px] bg-white hover:bg-[#F1F0EA] border border-[#D3D1C8] text-[#5C5750] hover:text-[#14110F] text-[11px] whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role !== 'user' && (
              <div className="w-6 h-6 rounded-[6px] bg-[#14110F] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-[#10A36B]" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-[10px] p-3 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#14110F] text-white rounded-tr-none shadow-xs'
                  : 'bg-[#FAF9F6] border border-[#E5E3DC] text-[#14110F] rounded-tl-none shadow-2xs'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{m.text}</div>
            </div>

            {m.role === 'user' && (
              <div className="w-6 h-6 rounded-[6px] bg-[#EAE8E0] text-[#14110F] flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {/* Pending Proposal Card */}
        {pendingProposal && (
          <div className="p-4 rounded-[10px] border border-[#D3D1C8] bg-[#FAF9F6] shadow-sm space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-2">
              <div className="flex items-center gap-2 text-[#B45309]">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {pendingProposal.type === 'new_product' ? 'Review New Inventory Item' : 'Review Proposed Inventory Movement'}
                </span>
              </div>
              <span className="font-mono text-[10px] bg-[#F1F0EA] px-2 py-0.5 rounded font-bold text-[#14110F]">
                Confirmation Required
              </span>
            </div>

            {pendingProposal.type === 'new_product' ? (
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white p-3 rounded-[8px] border border-[#E5E3DC]">
                <div>
                  <span className="text-[10px] text-[#5C5750] block">New Product:</span>
                  <span className="font-bold text-[#14110F]">{pendingProposal.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C5750] block">Starting Stock:</span>
                  <span className="font-bold text-[#0B7A50]">{formatQuantity(pendingProposal.quantity, pendingProposal.unit)}</span>
                </div>
                <p className="col-span-2 text-[10px] text-[#5C5750]">
                  A unique SKU will be generated when you confirm.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-white p-3 rounded-[8px] border border-[#E5E3DC]">
                <div>
                  <span className="text-[10px] text-[#5C5750] block">Action:</span>
                  <span className="font-bold uppercase text-[#14110F]">{pendingProposal.action}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C5750] block">SKU / Product:</span>
                  <span className="font-bold text-[#14110F] truncate block">
                    {pendingProposal.productName} ({pendingProposal.productCode})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C5750] block">Requested Delta:</span>
                  <span className="font-bold text-[#14110F]">
                    {pendingProposal.action === 'sale' ? '-' : '+'}
                    {pendingProposal.quantity} units
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#5C5750] block">Resulting Balance:</span>
                  <span className="font-bold text-[#0B7A50]">
                    {pendingProposal.proposedBalance !== null ? `${pendingProposal.proposedBalance} units` : 'Verified'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={onCancelProposal}
                disabled={loading}
                className="px-3 py-1.5 rounded-[8px] bg-white hover:bg-[#FAF9F6] border border-[#D3D1C8] text-xs text-[#5C5750] hover:text-[#14110F] cursor-pointer transition-colors"
              >
                {pendingProposal.type === 'new_product' ? (
                  <span className="flex items-center gap-1">
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </span>
                ) : 'Dismiss'}
              </button>
              <button
                onClick={onConfirmProposal}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-[8px] bg-[#10A36B] hover:bg-[#0B7A50] text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{pendingProposal.type === 'new_product' ? 'Confirm' : 'Confirm & Update Database'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-2 text-[#5C5750] text-xs font-mono py-2 bg-[#FAF9F6] p-2.5 rounded-[8px] border border-[#E5E3DC] w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5C5750]" />
            <span>Agent querying MongoDB Atlas & validating stock rules...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={onSendMessage}
        className="p-3 border-t border-[#E5E3DC] bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g., Sell 4 bags of Golden Flour or add 5 books..."
          disabled={loading}
          className="flex-1 bg-white border border-[#D3D1C8] focus:border-[#14110F] focus:outline-none rounded-[8px] px-3 py-2 text-xs text-[#14110F] placeholder-[#8A857D] shadow-xs"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-3.5 py-2 rounded-[8px] bg-[#14110F] hover:bg-black disabled:opacity-50 text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5 text-[#10A36B]" />
        </button>
      </form>
    </main>
  );
}
