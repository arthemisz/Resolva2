import React from 'react';

export default function StatusBadge({ status, className = '' }) {
  let badgeStyle = 'bg-[#F6E3B0] text-[#5A3F00] border-[#EED492]'; // Default: Open (Amber)

  if (status === 'Resolved' || status === 'In Outbox') {
    badgeStyle = 'bg-[#D5EEE2] text-[#0B5A3A] border-[#BCE1D1]'; // Sage
  } else if (status === 'Pending Customer Info' || status === 'Pending') {
    badgeStyle = 'bg-[#CBD7E6] text-[#1E3A66] border-[#B3C5DC]'; // Mist Blue
  } else if (status === 'Escalated') {
    badgeStyle = 'bg-[#F5D3C4] text-[#7A2A08] border-[#EDBCAB]'; // Rust
  }

  return (
    <span
      className={`inline-flex items-center font-mono text-[10px] font-medium px-2 py-0.5 rounded-full border ${badgeStyle} ${className}`}
    >
      {status}
    </span>
  );
}
