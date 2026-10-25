import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/sections/HeroSection';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section with 3D model - Public landing page */}
      <HeroSection />

      {/* Additional info section for non-authenticated users */}
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
