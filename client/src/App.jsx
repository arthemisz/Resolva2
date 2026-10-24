import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TicketProvider } from './context/TicketContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import FloatingScrollButton from './components/common/FloatingScrollButton';
import HomePage from './pages/HomePage';

function ScrollRedirect({ target }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [target]);

  return <HomePage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <TicketProvider>
        <div className="flex flex-col min-h-screen w-full bg-white text-[#14110F] font-sans antialiased selection:bg-[#10A36B]/20 selection:text-[#14110F] overflow-x-hidden">
          <Navbar />
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/studio" element={<ScrollRedirect target="studio" />} />
              <Route path="/benchmark" element={<ScrollRedirect target="benchmark" />} />
              <Route path="/architecture" element={<ScrollRedirect target="architecture" />} />
              <Route path="/policies" element={<ScrollRedirect target="policies" />} />
              <Route path="/outbox" element={<ScrollRedirect target="outbox" />} />
              <Route path="/faq" element={<ScrollRedirect target="faq" />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
          <FloatingScrollButton />
          <Toast />
        </div>
      </TicketProvider>
    </BrowserRouter>
  );
}
