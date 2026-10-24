import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { scrollToBottom, scrollToTop } from '../../utils/scroll';

export default function FloatingScrollButton() {
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      setHasScrolled(scrollY > 150);
      setIsNearBottom(scrollY + windowHeight >= documentHeight - 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (isNearBottom) {
      scrollToTop();
    } else {
      scrollToBottom();
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label={isNearBottom ? 'Scroll to top' : 'Scroll to bottom'}
      title={isNearBottom ? 'Back to top' : 'Scroll to bottom'}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#14110F] text-[#F1F0EA] hover:bg-black border border-zinc-700 shadow-xl cursor-pointer text-xs font-mono transition-all duration-200 hover:scale-105 active:scale-95 group"
    >
      {isNearBottom ? (
        <>
          <ArrowUp className="w-3.5 h-3.5 text-[#10A36B] group-hover:-translate-y-0.5 transition-transform" />
          <span className="hidden sm:inline font-semibold">Top</span>
        </>
      ) : (
        <>
          <ArrowDown className="w-3.5 h-3.5 text-[#10A36B] group-hover:translate-y-0.5 transition-transform" />
          <span className="hidden sm:inline font-semibold">Scroll to bottom</span>
        </>
      )}
    </button>
  );
}
