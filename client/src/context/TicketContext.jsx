import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { INITIAL_TICKETS } from '../data/tickets';
import { POLICIES, getPolicyById } from '../data/policies';

const TicketContext = createContext(null);

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [activeTicketId, setActiveTicketId] = useState('#1001');
  const [outbox, setOutbox] = useState([]);
  const [toast, setToast] = useState(null);

  // Copilot execution state
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(4);

  const activeTicket = useMemo(() => {
    return tickets.find(t => t.id === activeTicketId) || tickets[0];
  }, [tickets, activeTicketId]);

  const [draft, setDraft] = useState(activeTicket?.draft || '');

  useEffect(() => {
    if (activeTicket) {
      setDraft(activeTicket.draft);
      setScanStep(4);
    }
  }, [activeTicket?.id]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3200);
  };

  const activePolicy = useMemo(() => {
    return getPolicyById(activeTicket?.policyId);
  }, [activeTicket]);

  const toggleMissingField = (idx) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === activeTicket.id) {
          const next = [...t.missing];
          next[idx] = { ...next[idx], ok: !next[idx].ok };
          return { ...t, missing: next };
        }
        return t;
      })
    );
  };

  const runScan = () => {
    setIsScanning(true);
    setScanStep(1);
    setTimeout(() => {
      setScanStep(2);
      setTimeout(() => {
        setScanStep(3);
        setTimeout(() => {
          setScanStep(4);
          setIsScanning(false);
          showToast(`Policy check complete: ${activePolicy.id}`);
        }, 350);
      }, 350);
    }, 350);
  };

  const generateDraft = () => {
    const missingItems = activeTicket.missing.filter(m => !m.ok);
    let text = `Hello ${activeTicket.customer.split(' ')[0]},\n\nThank you for reaching out. Under our policy [${activeTicket.policyId}], we are reviewing your request.\n\n`;
    if (missingItems.length > 0) {
      text += `Before we can finalize this, please provide:\n`;
      missingItems.forEach(m => (text += `• ${m.name}\n`));
      text += `\nOnce verified, we will take care of this right away.\n\n`;
    } else {
      text += `All verification details are verified. Your resolution has been authorized.\n\n`;
    }
    text += `Best regards,\nResolva Support Officer`;
    setDraft(text);
    showToast('Draft regenerated based on policy');
  };

  const approveAndOutbox = () => {
    const record = {
      id: activeTicket.id,
      customer: activeTicket.customer,
      subject: activeTicket.subject,
      draft,
      policyId: activeTicket.policyId,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTickets(prev => prev.map(t => (t.id === activeTicket.id ? { ...t, status: 'Resolved', draft } : t)));
    setOutbox(prev => [record, ...prev.filter(o => o.id !== activeTicket.id)]);
    showToast(`Ticket ${activeTicket.id} moved to Outbox`);
  };

  const restoreTicket = (id) => {
    setTickets(prev => prev.map(t => (t.id === id ? { ...t, status: 'Open' } : t)));
    setOutbox(prev => prev.filter(o => o.id !== id));
    showToast(`Restored ${id} to Open queue`);
  };

  const resetAll = () => {
    setTickets(INITIAL_TICKETS);
    setOutbox([]);
    setActiveTicketId('#1001');
    setDraft(INITIAL_TICKETS[0].draft);
    showToast('Reset to original demo data');
  };

  const openCount = tickets.filter(t => t.status === 'Open').length;

  const value = {
    tickets,
    setTickets,
    activeTicketId,
    setActiveTicketId,
    activeTicket,
    activePolicy,
    draft,
    setDraft,
    outbox,
    openCount,
    toast,
    showToast,
    isScanning,
    scanStep,
    runScan,
    generateDraft,
    approveAndOutbox,
    restoreTicket,
    toggleMissingField,
    resetAll
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
