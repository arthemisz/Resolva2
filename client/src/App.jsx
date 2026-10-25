import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TicketProvider } from './context/TicketContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import FloatingScrollButton from './components/common/FloatingScrollButton';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './services/authApi';

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
              {/* Public landing page */}
              <Route path="/" element={
                isAuthenticated() ? <Navigate to="/home" replace /> : <LandingPage />
              } />

              {/* Auth routes */}
              <Route path="/login" element={
                isAuthenticated() ? <Navigate to="/home" replace /> : <LoginPage />
              } />
              <Route path="/register" element={
                isAuthenticated() ? <Navigate to="/home" replace /> : <RegisterPage />
              } />

              {/* Protected routes */}
              <Route path="/home" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/studio" element={
                <ProtectedRoute>
                  <ScrollRedirect target="studio" />
                </ProtectedRoute>
              } />
              <Route path="/benchmark" element={
                <ProtectedRoute>
                  <ScrollRedirect target="benchmark" />
                </ProtectedRoute>
              } />
              <Route path="/architecture" element={
                <ProtectedRoute>
                  <ScrollRedirect target="architecture" />
                </ProtectedRoute>
              } />
              <Route path="/policies" element={
                <ProtectedRoute>
                  <ScrollRedirect target="policies" />
                </ProtectedRoute>
              } />
              <Route path="/outbox" element={
                <ProtectedRoute>
                  <ScrollRedirect target="outbox" />
                </ProtectedRoute>
              } />
              <Route path="/faq" element={
                <ProtectedRoute>
                  <ScrollRedirect target="faq" />
                </ProtectedRoute>
              } />

              {/* Catch all - redirect to home or landing */}
              <Route path="*" element={
                isAuthenticated() ? <Navigate to="/home" replace /> : <Navigate to="/" replace />
              } />
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
