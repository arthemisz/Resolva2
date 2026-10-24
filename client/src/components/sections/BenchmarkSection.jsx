import React from 'react';
import demoVideo from '../../../assets/sub.mp4';

export default function BenchmarkSection() {
  return (
    <section id="benchmark" className="py-14 px-4 sm:px-8 max-w-5xl mx-auto w-full border-t border-[#E5E3DC]">
      <div className="mb-6 text-center">
        <span className="text-xs font-mono uppercase text-[#5C5750] font-semibold">See Resolva in action</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#14110F] mt-1">Benchmark</h2>
      </div>
      <div className="overflow-hidden rounded-[10px]">
        <video
          className="block w-full"
          src={demoVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-label="Resolva product demonstration"
        >
          Your browser does not support the video element.
        </video>
      </div>
    </section>
  );
}
