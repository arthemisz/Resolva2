import React, { useState } from 'react';
import { RotateCcw, Boxes, Headphones } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import InventoryStudio from '../components/studio/InventoryStudio';
import TicketFeed from '../components/studio/TicketFeed';
import CenterStage from '../components/studio/CenterStage';
import RightDrawer from '../components/studio/RightDrawer';

export default function DashboardPage() {
  const { openCount, resetAll } = useTickets();
  const [studioMode, setStudioMode] = useState('inventory'); // 'inventory' | 'tickets'

  return (
    <div className="py-8 px-4 sm:px-8 max-w-7xl mx-auto w-full">
      {/* Studio Header Bar */}
      <div className="flex flex-wrap items-end justify-between mb-5 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#5C5750] mb-1.5">
            <span className="text-[#14110F] font-semibold">Live Enterprise Copilot</span>
            <span>•</span>
            <span>MongoDB Atlas & Gemini 3.5</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14110F]">
            AI Studio: Operations & Resolution
          </h2>
          <p className="text-[#5C5750] text-xs sm:text-sm mt-1 max-w-2xl">
            Autonomous multi-modal operations desk. Issue plain English inventory movements to the live Gemini agent, or verify inbound customer claims against policies.
          </p>
        </div>

        {/* Studio Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#EAE8E0] p-1 rounded-[10px] border border-[#D3D1C8] text-xs font-medium">
            <button
              onClick={() => setStudioMode('inventory')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] cursor-pointer transition-all ${
                studioMode === 'inventory'
                  ? 'bg-white text-[#14110F] font-semibold shadow-xs'
                  : 'text-[#5C5750] hover:text-[#14110F]'
              }`}
            >
              <Boxes className="w-3.5 h-3.5 text-[#10A36B]" />
              <span>Inventory Agent</span>
            </button>

            <button
              onClick={() => setStudioMode('tickets')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] cursor-pointer transition-all ${
                studioMode === 'tickets'
                  ? 'bg-white text-[#14110F] font-semibold shadow-xs'
                  : 'text-[#5C5750] hover:text-[#14110F]'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 text-[#14110F]" />
              <span>Support Copilot</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#E5E3DC] text-[#14110F] font-semibold">
                {openCount}
              </span>
            </button>
          </div>

          {studioMode === 'tickets' && (
            <button
              onClick={resetAll}
              className="flex items-center gap-1 px-2.5 py-2 rounded-[10px] bg-white hover:bg-[#FAF9F6] border border-[#D3D1C8] text-xs text-[#14110F] cursor-pointer shadow-xs transition-colors"
              title="Reset demo support data"
            >
              <RotateCcw className="w-3 h-3 text-[#5C5750]" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Studio Workspace */}
      {studioMode === 'inventory' ? (
        <InventoryStudio />
      ) : (
        <div className="h-[750px] rounded-[10px] bg-white border border-[#D3D1C8] overflow-hidden flex flex-col md:flex-row shadow-sm">
          <TicketFeed />
          <CenterStage />
          <RightDrawer />
        </div>
      )}
    </div>
  );
}
