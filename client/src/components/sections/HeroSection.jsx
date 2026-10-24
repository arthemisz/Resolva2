import React from 'react';
import { ArrowDown, Terminal, Check } from 'lucide-react';
import ModelViewer from '../common/ModelViewer';
import { scrollToSection, scrollToBottom } from '../../utils/scroll';

export default function HeroSection() {
  return (
    <section id="hero" className="pt-10 pb-16 px-4 sm:px-8 max-w-5xl mx-auto w-full">
      <div className="rounded-[10px] bg-[#F1F0EA] text-[#14110F] p-6 sm:p-10 md:p-14 text-center space-y-6 shadow-sm border border-[#D3D1C8] overflow-hidden">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D3D1C8] text-xs font-mono text-[#5C5750]">
          <span className="text-[#14110F] font-semibold">Deterministic Support AI</span>
          <span>•</span>
          <span>Zero Hallucinations</span>
        </div>

        {/* 3D Model Viewer */}
        <ModelViewer />

        {/* Headline BELOW the 3D model */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-[-0.045em] text-[#14110F] leading-tight">
          Your inventory. Honest stock.
        </h1>

        {/* Supporting Subhead */}
        <p className="text-base sm:text-lg text-[#5C5750] leading-relaxed max-w-2xl mx-auto font-normal">
          Policy-checked support replies and plain-English stock updates, all reviewed by you. Because “I thought we had five” isn’t a stocktake.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => scrollToSection('studio')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#14110F] hover:bg-black text-[#F1F0EA] text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm group"
          >
            <span>Meet Resolva</span>
            <ArrowDown className="w-4 h-4 text-[#10A36B] group-hover:translate-y-0.5 transition-transform" />
          </button>
          
          <button
            onClick={() => scrollToSection('benchmark')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-white hover:bg-[#FAF9F6] text-[#14110F] border border-[#D3D1C8] text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-xs"
          >
            <Terminal className="w-3.5 h-3.5 text-[#14110F]" />
            <span>Try the benchmark</span>
          </button>

          <button
            onClick={scrollToBottom}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-white/70 hover:bg-white text-[#5C5750] hover:text-[#14110F] border border-[#D3D1C8] text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-xs group"
            title="Scroll through everything to the bottom"
          >
            <span>How it works</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#5C5750] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Micro-guarantee */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#5C5750] pt-2">
          <span>Deterministic citations</span>
          <span>•</span>
          <span>Human-in-the-loop oversight</span>
          <span>•</span>
          <span>Zero prompt engineering</span>
        </div>

      </div>
    </section>
  );
}
