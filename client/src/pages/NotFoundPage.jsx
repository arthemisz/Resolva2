import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="py-24 px-4 text-center space-y-4 max-w-md mx-auto">
      <div className="text-4xl font-bold font-mono text-[#14110F]">404</div>
      <h1 className="text-xl font-semibold text-[#14110F]">Page not found</h1>
      <p className="text-xs text-[#5C5750]">
        The page you are looking for does not exist or has been moved.
      </p>
      <div>
        <NavLink
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#14110F] text-white text-xs font-semibold hover:bg-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Overview</span>
        </NavLink>
      </div>
    </div>
  );
}
