import React, { useEffect } from 'react';
import HeroSection from '../components/sections/HeroSection';
import BenchmarkSection from '../components/sections/BenchmarkSection';
import StudioSection from '../components/sections/StudioSection';
import ArchitectureSection from '../components/sections/ArchitectureSection';
import PoliciesSection from '../components/sections/PoliciesSection';
import OutboxSection from '../components/sections/OutboxSection';
import FaqSection from '../components/sections/FaqSection';

export default function HomePage() {
  useEffect(() => {
    // Check if initial URL has a hash to scroll to
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {/* 1. Hero Overview with 3D model */}
      <HeroSection />

      {/* 2. Interactive Resolution Benchmark Sandbox */}
      <BenchmarkSection />

      {/* 3. Live 3-Pane AI Agent Studio */}
      <StudioSection />

      {/* 4. Architecture & 3 Pillars */}
      <ArchitectureSection />

      {/* 5. Standard Policy Directory */}
      <PoliciesSection />

      {/* 6. Internal Outbox Archive */}
      <OutboxSection />

      {/* 7. Frequently Asked Questions */}
      <FaqSection />
    </div>
  );
}
