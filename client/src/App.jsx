import React, { useState, useEffect, useRef } from 'react';
import { api } from './api';
import {
  Boxes, Send, CheckCircle2, History, AlertTriangle,
  ArrowUpRight, ArrowDownLeft, RefreshCcw, Sparkles, X, ShieldAlert
} from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Greetings! I am your AI Operations Agent. You can tell me to record sales, deliveries, or inventory returns in plain English (e.g. "Sell 5 bags of Golden Flour").'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingProposal, setPendingProposal] = useState(null);
  const [notification, setNotification] = useState(null);
  const chatEndRef = useRef(null);

  const loadData = async () => {
    try {
      const [prodData, txData] = await Promise.all([
        api.getProducts(),
        api.getTransactions()
      ]);
      setProducts(Array.isArray(prodData) ? prodData : []);
      setTransactions(Array.isArray(txData) ? txData : []);
    } catch (err) {
      console.error('Failed to load initial data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingProposal]);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const detectProposal = (text) => {
    const actionMatch = text.match(/Action:\s*(\w+)/i);
    const prodMatch = text.match(/Product:\s*(.+?)\s*\(([^)]+)\)/i);
    const qtyMatch = text.match(/Quantity:\s*(\d+)/i);
    const currentMatch = text.match(/Current Stock:\s*(\d+)/i);
    const proposedMatch = text.match(/Proposed Balance:\s*(\d+)/i);

    if (actionMatch && prodMatch && qtyMatch) {
      return {
        action: actionMatch[1].toLowerCase(),
        productName: prodMatch[1].trim(),
        productCode: prodMatch[2].trim(),
        quantity: parseInt(qtyMatch[1], 10),
        currentStock: currentMatch ? parseInt(currentMatch[1], 10) : null,
        proposedBalance: proposedMatch ? parseInt(proposedMatch[1], 10) : null,
      };
    }
    return null;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    const newHistory = [...messages, { role: 'user', text: userText }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const historyPayload = newHistory.map(m => ({ role: m.role, text: m.text }));
      const response = await api.sendChatMessage(userText, historyPayload);

      if (response.reply) {
        setMessages(prev => [...prev, { role: 'assistant', text: response.reply }]);

        const proposal = detectProposal(response.reply);
        if (proposal) {
          setPendingProposal(proposal);
        }
      } else if (response.error) {
        setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ ${response.error}` }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Connection error to the agent server.' }]);
    } finally {
      setLoading(false);
    }
  };

  const executeConfirmation = async () => {
    if (!pendingProposal) return;
    setLoading(true);

    try {
      const res = await api.confirmTransaction({
        productCode: pendingProposal.productCode,
        transactionType: pendingProposal.action,
        quantity: pendingProposal.quantity
      });

      if (res.success) {
        showToast(`Transaction confirmed! Recorded with ID: ${res.transactionId.slice(-6)}`);
        setMessages(prev => [
          ...prev,
          { role: 'assistant', text: `✅ Confirmed: ${pendingProposal.action.toUpperCase()} of ${pendingProposal.quantity} units for ${pendingProposal.productName}. New balance: ${res.newStock}.` }
        ]);
        setPendingProposal(null);
        await loadData();
      } else {
        showToast(res.error || 'Failed to record movement', 'error');
      }
    } catch (err) {
      showToast('Error recording transaction', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {notification && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl border glass-panel shadow-2xl flex items-center space-x-3 transition-all ${notification.type === 'error' ? 'border-rose-500/50 text-rose-300' : 'border-emerald-500/50 text-emerald-300'
          }`}>
          {notification.type === 'error' ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span className="text-sm font-medium">{notification.msg}</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/10 glass-panel px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              NexusOps Agent
            </h1>
            <p className="text-xs text-slate-400">Autonomous Inventory Intelligence</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">MongoDB Atlas Connected</span>
          </div>
          <button
            onClick={loadData}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition"
            title="Refresh Stock"
          >
            <RefreshCcw className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stock Overview & Audit Ledger */}
        <section className="lg:col-span-7 flex flex-col space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Live Inventory Balances</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time stock synced directly from cloud storage</p>
            </div>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/30 font-mono">
              {products.length} Assigned SKUs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map(p => {
              const isLow = p.quantity < 10;
              return (
                <div
                  key={p.code}
                  className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-indigo-500/40 transition duration-300 relative group overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-mono px-2 py-1 bg-white/5 rounded-md text-slate-400 border border-white/5">
                      {p.code}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${isLow ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                      {isLow ? 'Low Stock' : 'Adequate'}
                    </span>
                  </div>

                  <h3 className="font-medium text-slate-200 group-hover:text-white transition">{p.name}</h3>

                  <div className="mt-4 flex items-baseline space-x-2">
                    <span className="text-3xl font-bold tracking-tight text-white">{p.quantity}</span>
                    <span className="text-xs text-slate-400 font-medium">{p.unit}s in stock</span>
                  </div>

                  <div className="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${isLow ? 'bg-amber-400' : 'bg-indigo-500'}`}
                      style={{ width: `${Math.min(100, (p.quantity / 30) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex-1 flex flex-col">
            <div className="flex items-center space-x-2 mb-4">
              <History className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-white">Audit Ledger (Past Movements)</h2>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto max-h-[220px] pr-2">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">No recorded transactions yet.</div>
              ) : (
                transactions.map(tx => (
                  <div
                    key={tx._id}
                    onClick={() => setSelectedTx(tx)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 cursor-pointer transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${tx.type === 'sale' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                        {tx.type === 'sale' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-slate-200 uppercase">{tx.type} • {tx.productCode}</div>
                        <div className="text-[11px] text-slate-400">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-white">
                        {tx.type === 'sale' ? `-${tx.quantity}` : `+${tx.quantity}`}
                      </div>
                      <div className="text-[10px] text-indigo-400 hover:underline">Reopen Snapshot →</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Right Column: AI Terminal */}
        <section className="lg:col-span-5 flex flex-col h-[750px] glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">AI Operations Copilot</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">gemini-3.5-flash-lite</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${m.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-none shadow-md shadow-indigo-500/20'
                    : 'bg-white/5 border border-white/10 text-slate-300 rounded-bl-none'
                  }`}>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
              </div>
            ))}

            {pendingProposal && (
              <div className="p-4 rounded-xl border border-indigo-500/40 bg-indigo-950/30 backdrop-blur-md space-y-3">
                <div className="flex items-center space-x-2 text-indigo-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Review Proposed Movement</span>
                </div>

                <div className="text-xs space-y-1.5 bg-black/30 p-3 rounded-lg border border-white/5 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Action:</span>
                    <span className="text-indigo-300 uppercase font-bold">{pendingProposal.action}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>SKU:</span>
                    <span className="text-white">{pendingProposal.productName} ({pendingProposal.productCode})</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Requested Movement:</span>
                    <span className="text-white">{pendingProposal.quantity} units</span>
                  </div>
                  {pendingProposal.proposedBalance !== null && (
                    <div className="flex justify-between border-t border-white/10 pt-1 text-slate-300">
                      <span>Resulting Stock:</span>
                      <span className="text-emerald-400 font-bold">{pendingProposal.proposedBalance} units</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 pt-1">
                  <button
                    onClick={executeConfirmation}
                    disabled={loading}
                    className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center justify-center space-x-1.5 shadow-lg shadow-indigo-500/30"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Movement</span>
                  </button>
                  <button
                    onClick={() => setPendingProposal(null)}
                    disabled={loading}
                    className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-xs transition"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>Agent checking database & calculating balances...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-white/[0.02] flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Sell 4 bags of Golden Flour..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition shadow-md shadow-indigo-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      </main>

      {/* Snapshot Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-semibold text-white mb-1">Archived Transaction Snapshot</h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">ID: {selectedTx._id}</p>

            <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Product:</span>
                <span className="text-white font-semibold">{selectedTx.productCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Movement Type:</span>
                <span className="uppercase text-indigo-400 font-bold">{selectedTx.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recorded Quantity:</span>
                <span className="text-white">{selectedTx.quantity} units</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2">
                <span className="text-slate-400">Previous Balance:</span>
                <span className="text-slate-300">{selectedTx.previousStock} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">New Balance:</span>
                <span className="text-emerald-400 font-bold">{selectedTx.newStock} units</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2">
                <span className="text-slate-400">Executed At:</span>
                <span className="text-slate-300">{new Date(selectedTx.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}