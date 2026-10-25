import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ModelViewer from '../components/common/ModelViewer';
import BenchmarkSection from '../components/sections/BenchmarkSection';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section - Public Landing Page */}
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
            Policy-checked support replies and plain-English stock updates, all reviewed by you. Because "I thought we had five" isn't a stocktake.
          </p>

          {/* Action CTAs for Landing Page */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/register')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#14110F] hover:bg-black text-[#F1F0EA] text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-[#10A36B] group-hover:translate-x-0.5 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-white hover:bg-[#FAF9F6] text-[#14110F] border border-[#D3D1C8] text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-xs"
            >
              <span>Sign In</span>
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

      {/* Benchmark Section - Motion Graphics */}
      <BenchmarkSection />

      {/* Demo Section */}
      <section className="py-16 px-4 sm:px-8 max-w-3xl mx-auto w-full text-center">
        <div className="p-8 rounded-[10px] bg-[#F1F0EA] border border-[#D3D1C8]">
          <h2 className="text-3xl font-bold text-[#14110F] mb-4">Try the Demo</h2>
          <p className="text-[#5C5750] mb-6">
            Want to see it in action? Login with our demo account and explore the full features.
          </p>
          <div className="inline-flex flex-col gap-2 p-4 rounded-[8px] bg-white border border-[#D3D1C8] text-left">
            <div className="text-xs font-mono text-[#5C5750]">
              <span className="font-semibold text-[#14110F]">Email:</span> demo@resolva.com
            </div>
            <div className="text-xs font-mono text-[#5C5750]">
              <span className="font-semibold text-[#14110F]">Password:</span> demo123
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 rounded-[10px] bg-[#14110F] hover:bg-black text-[#F1F0EA] text-sm font-semibold transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2.5 rounded-[10px] bg-white hover:bg-[#FAF9F6] text-[#14110F] border border-[#D3D1C8] text-sm font-medium transition-colors cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
