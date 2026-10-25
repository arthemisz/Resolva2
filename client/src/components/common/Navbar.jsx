import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowDown, RotateCcw, ChevronDown, Check, LogOut } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { scrollToSection, scrollToBottom, scrollToTop } from '../../utils/scroll';
import { isAuthenticated, logout } from '../../services/authApi';
import ResolvaLogo from './ResolvaLogo';

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
  const navigate = useNavigate();
  const location = useLocation();
  const { openCount, outbox, resetAll } = useTickets();
  const [activeSection, setActiveSection] = useState('hero');
  const authenticated = isAuthenticated();

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_4px_30px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.8)] px-4 sm:px-8 flex flex-col shrink-0">
      <div className="h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => authenticated ? scrollToTop() : navigate('/')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-[6px] bg-[#14110F] flex items-center justify-center transition-transform group-hover:scale-105">
              <ResolvaLogo className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#14110F]">Resolva</span>
            <span className="hidden sm:inline text-xs font-mono text-[#5C5750]">v2.4</span>
          </button>

          {/* Desktop Navigation - Only show when authenticated */}
          {authenticated && (
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
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {authenticated ? (
            <>
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

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] text-xs text-[#5C5750] hover:text-[#14110F] hover:bg-[#F5F4F0] border border-[#D3D1C8] cursor-pointer transition-colors"
                title="Logout"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-[10px] text-xs text-[#5C5750] hover:text-[#14110F] hover:bg-[#F5F4F0] border border-[#D3D1C8] cursor-pointer transition-colors font-medium"
              >
                Sign In
              </button>

              <button
                onClick={() => navigate('/register')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] bg-[#14110F] hover:bg-black text-[#F1F0EA] text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Horizontal Section Tabs (Under 1024px) - Only show when authenticated */}
      {authenticated && (
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
      )}
    </header>
  );
}
