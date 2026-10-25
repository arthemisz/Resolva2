import React from 'react';
import { Boxes } from 'lucide-react';
import InventoryStudio from '../components/studio/InventoryStudio';

export default function DashboardPage() {
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

        {/* Active Mode Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#EAE8E0] p-1 rounded-[10px] border border-[#D3D1C8] text-xs font-medium">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-white text-[#14110F] font-semibold shadow-xs">
              <Boxes className="w-3.5 h-3.5 text-[#10A36B]" />
              <span>Inventory Agent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Studio Workspace */}
      <InventoryStudio />
    </div>
  );
}
