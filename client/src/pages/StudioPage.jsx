import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import TicketFeed from '../components/studio/TicketFeed';
import CenterStage from '../components/studio/CenterStage';
import RightDrawer from '../components/studio/RightDrawer';

export default function StudioPage() {
  const { openCount, outbox, resetAll } = useTickets();

  return (
    <div className="py-8 px-4 sm:px-8 max-w-7xl mx-auto w-full">
      {/* Studio Section Title */}
      <div className="flex flex-wrap items-end justify-between mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#5C5750] mb-1">
            <span>Live Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14110F]">
            AI Resolution Studio
          </h1>
          <p className="text-[#5C5750] text-xs sm:text-sm mt-1">
            Deterministic 3-pane copilot desk. Review tickets, verify policy parameters, and approve directly into dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#5C5750]">
            {openCount} Open • {outbox.length} in Outbox
          </span>
          <button
            onClick={resetAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] bg-white hover:bg-[#FAF9F6] border border-[#D3D1C8] text-xs text-[#14110F] cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3 h-3 text-[#5C5750]" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      {/* The 3-Pane Workbench Frame */}
      <div className="h-[750px] rounded-[10px] bg-white border border-[#D3D1C8] overflow-hidden flex flex-col md:flex-row shadow-sm">
        <TicketFeed />
        <CenterStage />
        <RightDrawer />
      </div>
    </div>
  );
}
