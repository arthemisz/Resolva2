import React from 'react';
import { History, ArrowUpRight, ArrowDownLeft, Eye } from 'lucide-react';

export default function InventoryAuditLedger({ transactions, onSelectTransaction }) {
  return (
    <aside className="w-full md:w-80 border-l border-[#E5E3DC] bg-[#FAF9F6] flex flex-col shrink-0 p-3 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DC] mb-2">
        <div className="flex items-center gap-1.5 font-semibold text-[#14110F]">
          <History className="w-4 h-4 text-[#14110F]" />
          <span>Audit Ledger</span>
        </div>
        <span className="font-mono text-[10px] bg-[#EAE8E0] text-[#14110F] px-1.5 py-0.5 rounded font-semibold border border-[#D3D1C8]">
          {transactions.length} Records
        </span>
      </div>

      <div className="space-y-2 overflow-y-auto flex-1 pr-0.5">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-[#5C5750] bg-white rounded-[8px] border border-[#E5E3DC]">
            No recorded movements yet. Confirm a transaction to see it here.
          </div>
        ) : (
          transactions.map(tx => {
            const isSale = tx.type === 'sale';
            return (
              <div
                key={tx._id}
                onClick={() => onSelectTransaction && onSelectTransaction(tx)}
                className="p-2.5 rounded-[8px] bg-white border border-[#E5E3DC] hover:border-[#D3D1C8] cursor-pointer transition-colors space-y-1.5 shadow-2xs group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1 rounded-[4px] ${
                        isSale
                          ? 'bg-[#FEE2E2] text-[#991B1B]'
                          : 'bg-[#D1FAE5] text-[#065F46]'
                      }`}
                    >
                      {isSale ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <span className="font-mono text-[11px] font-bold text-[#14110F] uppercase">
                        {tx.type} • {tx.productCode}
                      </span>
                      <span className="text-[10px] text-[#5C5750] block font-mono">
                        {new Date(tx.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono font-bold text-xs ${
                        isSale ? 'text-[#991B1B]' : 'text-[#065F46]'
                      }`}
                    >
                      {isSale ? `-${tx.quantity}` : `+${tx.quantity}`}
                    </span>
                    <span className="text-[9px] text-[#5C5750] block group-hover:text-[#10A36B] transition-colors flex items-center justify-end gap-0.5">
                      <Eye className="w-2.5 h-2.5" />
                      <span>Snapshot</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
