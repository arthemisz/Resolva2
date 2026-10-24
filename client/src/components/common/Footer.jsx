import React from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollToSection, scrollToTop } from '../../utils/scroll';

export default function Footer() {
  return (
    <footer id="bottom" className="border-t border-[#E5E3DC] bg-[#FAF9F6] py-12 px-4 sm:px-8 text-xs text-[#5C5750] text-center font-mono space-y-4 mt-auto">
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-[#8A857D] text-xs">
        <button
          onClick={() => scrollToSection('hero')}
          className="hover:text-[#14110F] cursor-pointer transition-colors"
        >
          Overview
        </button>
        <span>•</span>
        <button
          onClick={() => scrollToSection('benchmark')}
          className="hover:text-[#14110F] cursor-pointer transition-colors"
        >
          Benchmark
        </button>
        <span>•</span>
        <button
          onClick={() => scrollToSection('studio')}
          className="hover:text-[#14110F] cursor-pointer transition-colors"
        >
          Studio
        </button>
        <span>•</span>
        <button
          onClick={() => scrollToSection('architecture')}
          className="hover:text-[#14110F] cursor-pointer transition-colors"
        >
          Architecture
        </button>
        <span>•</span>
        <button
          onClick={() => scrollToSection('policies')}
          className="hover:text-[#14110F] cursor-pointer transition-colors"
        >
          Policies
        </button>
        <span>•</span>
        <button
          onClick={() => scrollToSection('outbox')}
          className="hover:text-[#14110F] cursor-pointer transition-colors"
        >
          Outbox
        </button>
        <span>•</span>
        <button
          onClick={() => scrollToSection('faq')}
          className="hover:text-[#14110F] cursor-pointer transition-colors"
        >
          FAQ
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[11px] text-[#5C5750]">
        <div>© 2026 Resolva Systems. Built for enterprise customer support teams.</div>
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-white border border-[#D3D1C8] hover:bg-[#F5F4F0] text-[#14110F] transition-colors cursor-pointer group shadow-2xs"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3 h-3 text-[#10A36B] group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
}
