import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../data/faqs';

export default function FaqPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="py-16 px-4 sm:px-8 max-w-3xl mx-auto w-full space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-[#5C5750] block">
          Knowledge & Architecture
        </span>
        <h1 className="text-3xl font-bold text-[#14110F]">Frequently asked questions</h1>
        <p className="text-xs sm:text-sm text-[#5C5750]">
          Common questions about how Resolva evaluates policies, prevents hallucinations, and fits enterprise workflows.
        </p>
      </div>

      <div className="space-y-3 pt-4">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="rounded-[10px] bg-white border border-[#E5E3DC] shadow-sm overflow-hidden text-xs">
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full text-left p-4 flex justify-between items-center text-[#14110F] hover:bg-[#FAF9F6] cursor-pointer transition-colors"
            >
              <span className="font-semibold text-sm">{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#5C5750] transition-transform duration-200 ${
                  openFaq === idx ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openFaq === idx && (
              <div className="px-4 pb-4 text-[#5C5750] text-xs leading-relaxed border-t border-[#EAE8E2] pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
