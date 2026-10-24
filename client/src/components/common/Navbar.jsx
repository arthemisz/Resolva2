import React, { useState, useEffect } from 'react';
import { ArrowDown, RotateCcw, ChevronDown, Check } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { scrollToSection, scrollToBottom, scrollToTop } from '../../utils/scroll';

const NAV_ITEMS = [
  { id: 'hero', label: 'Overview' },
  { id: 'benchmark', label: 'Benchmark' },
  { id: 'studio', label: 'Studio', hasOpenCount: true },
  { id: 'architecture', label: 'Architecture' },
  { id: 'policies', label: 'Policies' },
  { id: 'outbox', label: 'Outbox', hasOutboxCount: true },
  { id: 'faq', label: 'FAQ' }
];

export default function Navbar() {
  const { openCount, outbox, resetAll } = useTickets();
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      // If at very bottom
      if (window.scrollY + winHeight >= docHeight - 80) {
        setActiveSection('faq');
        return;
      }

      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(NAV_ITEMS[i].id);
          return;
        }
      }
      setActiveSection('hero');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E3DC] bg-white/95 backdrop-blur-md px-4 sm:px-8 flex flex-col shrink-0">
      <div className="h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-[6px] bg-[#14110F] flex items-center justify-center transition-transform group-hover:scale-105">
              <svg viewBox="0 0 160 160" className="w-3.5 h-3.5">
                <path
                  d="M56 36H104A22 22 0 0 1 126 58V88A22 22 0 0 1 104 110H72L50 132V110H56A22 22 0 0 1 34 88V58A22 22 0 0 1 56 36Z"
                  fill="#FFF"
                />
                <polyline
                  points="57,74 73,89 104,57"
                  fill="none"
                  stroke="#14110F"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="124" cy="38" r="14" fill="#10A36B" stroke="#14110F" strokeWidth="4" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-[#14110F]">resolva</span>
            <span className="hidden sm:inline text-xs font-mono text-[#5C5750]">v2.4</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {NAV_ITEMS.map(item => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-1.5 rounded-[8px] text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#F1F0EA] text-[#14110F] font-semibold'
                      : 'text-[#5C5750] hover:text-[#14110F] hover:bg-[#FAF9F6]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasOpenCount && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#E5E3DC] text-[#14110F] font-semibold">
                      {openCount}
                    </span>
                  )}
                  {item.hasOutboxCount && outbox.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#14110F] text-white font-bold">
                      {outbox.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollToSection('studio')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] bg-[#14110F] hover:bg-black text-[#F1F0EA] text-xs font-semibold transition-colors cursor-pointer shadow-xs group"
          >
            <span>Open Studio</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#10A36B] group-hover:translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={scrollToBottom}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] text-xs text-[#5C5750] hover:text-[#14110F] hover:bg-[#F5F4F0] border border-[#D3D1C8] cursor-pointer transition-colors"
            title="Scroll directly to page bottom"
          >
            <ArrowDown className="w-3 h-3" />
            <span className="hidden md:inline">Bottom</span>
          </button>

          <button
            onClick={resetAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] text-xs text-[#5C5750] hover:text-[#14110F] hover:bg-[#F5F4F0] border border-[#D3D1C8] cursor-pointer transition-colors"
            title="Reset demo data"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Section Tabs (Under 1024px) */}
      <div className="lg:hidden flex items-center gap-1 py-1.5 overflow-x-auto border-t border-[#EAE8E2] text-xs scrollbar-none">
        {NAV_ITEMS.map(item => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-2.5 py-1 rounded-[6px] text-[11px] whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                isActive
                  ? 'bg-[#14110F] text-white font-semibold'
                  : 'text-[#5C5750] hover:text-[#14110F] bg-[#FAF9F6]'
              }`}
            >
              <span>{item.label}</span>
              {item.hasOpenCount && <span>({openCount})</span>}
              {item.hasOutboxCount && outbox.length > 0 && <span>({outbox.length})</span>}
            </button>
          );
        })}
      </div>
    </header>
  );
}
