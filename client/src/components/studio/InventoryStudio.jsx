import React, { useState, useEffect } from 'react';
import { inventoryApi } from '../../services/inventoryApi';
import { useTickets } from '../../context/TicketContext';
import InventoryStockFeed from './InventoryStockFeed';
import InventoryChatStage from './InventoryChatStage';
import InventoryAuditLedger from './InventoryAuditLedger';
import TransactionSnapshotModal from './TransactionSnapshotModal';

const formatQuantity = (quantity, unit) => {
  if (quantity === 1 || unit.endsWith('s')) return `${quantity} ${unit}`;
  if (/(x|ch|sh|z)$/.test(unit)) return `${quantity} ${unit}es`;
  if (/[^aeiou]y$/.test(unit)) return `${quantity} ${unit.slice(0, -1)}ies`;
  return `${quantity} ${unit}s`;
};

const welcomeMessage = {
  role: 'assistant',
  text: 'Greetings! I am your AI Operations Agent. You can tell me to record sales, deliveries, or inventory returns in plain English (e.g., "Sell 5 bags of Golden Flour").'
};

export default function InventoryStudio() {
  const { showToast } = useTickets();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [pendingProposal, setPendingProposal] = useState(null);
  const [messages, setMessages] = useState([welcomeMessage]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodData, txData] = await Promise.all([
        inventoryApi.getProducts().catch(() => []),
        inventoryApi.getTransactions().catch(() => [])
      ]);
      setProducts(Array.isArray(prodData) ? prodData : []);
      setTransactions(Array.isArray(txData) ? txData : []);
    } catch (err) {
      console.error('Failed to load inventory data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    const newHistory = [...messages, { role: 'user', text: userText }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const historyPayload = newHistory.map(m => ({ role: m.role, text: m.text }));
      const response = await inventoryApi.sendChatMessage(userText, historyPayload);

      if (response.reply) {
        setMessages(prev => [...prev, { role: 'assistant', text: response.reply }]);
        const proposal = response.productProposal
          ? { ...response.productProposal, type: 'new_product' }
          : detectProposal(response.reply);
        if (proposal) {
          setPendingProposal(proposal);
          showToast(proposal.type === 'new_product'
            ? `New Product Proposal: ${proposal.name}`
            : `Movement Proposal: ${proposal.action.toUpperCase()} ${proposal.quantity} ${proposal.productName}`);
        }
      } else if (response.error) {
        setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ ${response.error}` }]);
        showToast(response.error);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `⚠️ Could not reach agent backend at http://localhost:5000: ${err.message}`
        }
      ]);
      showToast('Backend connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmProposal = async () => {
    if (!pendingProposal) return;
    setLoading(true);

    try {
      if (pendingProposal.type === 'new_product') {
        const result = await inventoryApi.createProduct(pendingProposal);
        const product = result.product;
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: `✅ Created ${product.name} (${product.code}) with ${formatQuantity(product.quantity, product.unit)} in stock.`
          }
        ]);
        showToast(`Created ${product.name} • Stock: ${product.quantity}`);
        setPendingProposal(null);
        await loadData();
        return;
      }

      const res = await inventoryApi.confirmTransaction({
        productCode: pendingProposal.productCode,
        transactionType: pendingProposal.action,
        quantity: pendingProposal.quantity
      });

      if (res.success) {
        const shortId = res.transactionId ? String(res.transactionId).slice(-6) : 'Recorded';
        showToast(`Transaction confirmed (#${shortId}) • New Balance: ${res.newStock}`);
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: `✅ Confirmed: ${pendingProposal.action.toUpperCase()} of ${pendingProposal.quantity} units for ${pendingProposal.productName}. Resulting stock balance in database is now ${res.newStock}.`
          }
        ]);
        setPendingProposal(null);
        await loadData();
      } else {
        showToast(res.error || 'Failed to record transaction');
      }
    } catch (err) {
      showToast(err.message || 'Error recording transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product) => {
    setInput(`Check stock and status for ${product.name} (${product.code})`);
  };

  const handleClearChat = () => {
    setMessages([welcomeMessage]);
    setPendingProposal(null);
    setInput('');
  };

  return (
    <>
      <div className="h-[750px] rounded-[10px] bg-white border border-[#D3D1C8] overflow-hidden flex flex-col md:flex-row shadow-sm">
        {/* Left: Live Stock SKUs */}
        <InventoryStockFeed
          products={products}
          loading={loading}
          onRefresh={loadData}
          onSelectProduct={handleSelectProduct}
        />

        {/* Center: AI Copilot Chat & Proposals */}
        <InventoryChatStage
          messages={messages}
          input={input}
          setInput={setInput}
          loading={loading}
          pendingProposal={pendingProposal}
          onCancelProposal={() => setPendingProposal(null)}
          onClearChat={handleClearChat}
          onSendMessage={handleSend}
          onConfirmProposal={handleConfirmProposal}
        />

        {/* Right: Audit Ledger */}
        <InventoryAuditLedger
          transactions={transactions}
          onSelectTransaction={setSelectedTx}
        />
      </div>

      {/* Snapshot Modal */}
      {selectedTx && (
        <TransactionSnapshotModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </>
  );
}
