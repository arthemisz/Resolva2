import React from 'react';
import { Check } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';

export default function Toast() {
  const { toast } = useTickets();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] bg-[#14110F] border border-zinc-700 text-xs text-[#F1F0EA] shadow-xl">
      <Check className="w-3.5 h-3.5 text-[#10A36B]" />
      <span>{toast}</span>
    </div>
  );
}
