import React from 'react';
import { X, ShieldCheck, Clock, Layers } from 'lucide-react';

export default function TransactionSnapshotModal({ transaction, onClose }) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#D3D1C8] w-full max-w-md rounded-[10px] p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#5C5750] hover:text-[#14110F] rounded-[6px] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#14110F]">
            Archived Transaction Snapshot
          </h3>
          <p className="text-xs text-[#5C5750] font-mono">
            Transaction ID: {transaction._id}
          </p>
        </div>

        <div className="space-y-2.5 bg-[#FAF9F6] p-4 rounded-[8px] border border-[#E5E3DC] text-xs font-mono">
          <div className="flex justify-between items-center">
            <span className="text-[#5C5750]">Target SKU Code:</span>
            <span className="text-[#14110F] font-bold bg-white px-2 py-0.5 rounded border border-[#D3D1C8]">
              {transaction.productCode}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#5C5750]">Movement Type:</span>
            <span className="uppercase font-bold text-[#14110F]">
              {transaction.type}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#5C5750]">Recorded Quantity:</span>
            <span className="text-[#14110F] font-bold">
              {transaction.type === 'sale' ? '-' : '+'}
              {transaction.quantity} units
            </span>
          </div>

          <div className="border-t border-[#E5E3DC] pt-2 flex justify-between items-center">
            <span className="text-[#5C5750]">Previous Stock Balance:</span>
            <span className="text-[#5C5750] font-medium">
              {transaction.previousStock} units
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#5C5750]">New Stock Balance:</span>
            <span className="text-[#0B7A50] font-bold">
              {transaction.newStock} units
            </span>
          </div>

          <div className="border-t border-[#E5E3DC] pt-2 flex justify-between items-center text-[11px]">
            <span className="text-[#5C5750]">Executed Timestamp:</span>
            <span className="text-[#14110F]">
              {new Date(transaction.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#5C5750]">Audit Verification:</span>
            <span className="text-[#0B7A50] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Immutable Ledger Record</span>
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-[8px] bg-[#14110F] hover:bg-black text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Snapshot
          </button>
        </div>
      </div>
    </div>
  );
}
