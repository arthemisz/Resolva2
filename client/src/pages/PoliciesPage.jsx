import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';
import { POLICIES } from '../data/policies';

export default function PoliciesPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredPolicies = useMemo(() => {
    if (!search.trim()) return POLICIES;
    const q = search.toLowerCase();
    return POLICIES.filter(
      p =>
        p.id.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="py-12 px-4 sm:px-8 max-w-5xl mx-auto w-full">
      <div className="flex flex-wrap items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#5C5750] block mb-1">
            Knowledge Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14110F]">
            Standard Policy Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5750] mt-1">
            Explore company support policies, deterministic clause evaluations, and required proof parameters.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#5C5750] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search policies or clauses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-[#D3D1C8] focus:border-[#14110F] focus:outline-none text-xs text-[#14110F] placeholder-[#8A857D] pl-8 pr-3 py-2 rounded-[10px] shadow-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredPolicies.map(p => (
          <div key={p.id} className="p-5 rounded-[10px] bg-white border border-[#E5E3DC] shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center font-mono text-[11px]">
                <span className="font-bold text-[#14110F] bg-[#F1F0EA] px-2 py-0.5 rounded border border-[#D3D1C8]">
                  {p.id}
                </span>
                <span className="text-[#5C5750] text-[10px]">{p.category}</span>
              </div>

              <h2 className="font-semibold text-[#14110F] text-base">{p.title}</h2>
              <p className="text-[#5C5750] text-xs leading-relaxed">{p.summary}</p>

              <div className="space-y-1.5 pt-2 border-t border-[#EAE8E2]">
                <span className="text-[11px] font-semibold text-[#14110F] block">Clauses</span>
                <ul className="space-y-1 text-xs text-[#5C5750]">
                  {p.clauses.map((clause, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#10A36B] font-bold">•</span>
                      <span>{clause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE8E2] text-[11px] text-[#5C5750] font-mono">
              <span className="text-[#14110F] font-semibold block mb-0.5">Required Proof:</span>
              <span>{p.fields.join(' • ')}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 rounded-[10px] bg-[#FAF9F6] border border-[#E5E3DC] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-white border border-[#D3D1C8] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#10A36B]" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#14110F]">Need to test these policies on tickets?</h3>
            <p className="text-xs text-[#5C5750]">Jump directly into the AI Resolution Studio to run policy audits.</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/studio')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#14110F] text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
        >
          <span>Open Studio</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#10A36B]" />
        </button>
      </div>
    </div>
  );
}
