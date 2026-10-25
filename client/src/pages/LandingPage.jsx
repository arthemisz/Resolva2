import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Package, TrendingUp, Shield } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="rounded-[10px] bg-[#F1F0EA] text-[#14110F] p-6 sm:p-10 md:p-14 text-center space-y-6 shadow-sm border border-[#D3D1C8]">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D3D1C8] text-xs font-mono text-[#5C5750]">
            <span className="text-[#14110F] font-semibold">AI-Powered Inventory</span>
            <span>•</span>
            <span>Natural Language Control</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-[-0.045em] text-[#14110F] leading-tight">
            Your inventory. Honest stock.
          </h1>

          {/* Supporting Subhead */}
          <p className="text-base sm:text-lg text-[#5C5750] leading-relaxed max-w-2xl mx-auto font-normal">
            Manage your warehouse inventory through natural conversation. Just tell the AI what you need—no forms, no clicks, just plain English.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => navigate('/register')}
              className="flex items-center gap-2 px-6 py-3 rounded-[10px] bg-[#14110F] hover:bg-black text-[#F1F0EA] text-sm font-semibold transition-colors cursor-pointer shadow-sm group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-[#10A36B] group-hover:translate-x-0.5 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-6 py-3 rounded-[10px] bg-white hover:bg-[#FAF9F6] text-[#14110F] border border-[#D3D1C8] text-sm font-medium transition-colors cursor-pointer shadow-xs"
            >
              <span>Sign In</span>
            </button>
          </div>

          {/* Features */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#5C5750] pt-4">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#10A36B]" />
              <span>Real-time updates</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#10A36B]" />
              <span>AI-powered chat</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#10A36B]" />
              <span>Secure & reliable</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-[10px] bg-[#FAF9F6] border border-[#D3D1C8]">
            <div className="w-10 h-10 rounded-[8px] bg-[#14110F] flex items-center justify-center mb-4">
              <Package className="w-5 h-5 text-[#10A36B]" />
            </div>
            <h3 className="text-lg font-bold text-[#14110F] mb-2">Natural Language</h3>
            <p className="text-sm text-[#5C5750] leading-relaxed">
              "Sell 5 bags of flour" – that's all you need. No forms, no complicated interfaces. Just talk to your inventory.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-[10px] bg-[#FAF9F6] border border-[#D3D1C8]">
            <div className="w-10 h-10 rounded-[8px] bg-[#14110F] flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-[#10A36B]" />
            </div>
            <h3 className="text-lg font-bold text-[#14110F] mb-2">Real-Time Updates</h3>
            <p className="text-sm text-[#5C5750] leading-relaxed">
              Every sale, delivery, or return is tracked instantly. See your stock levels update in real-time.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-[10px] bg-[#FAF9F6] border border-[#D3D1C8]">
            <div className="w-10 h-10 rounded-[8px] bg-[#14110F] flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-[#10A36B]" />
            </div>
            <h3 className="text-lg font-bold text-[#14110F] mb-2">Safe & Secure</h3>
            <p className="text-sm text-[#5C5750] leading-relaxed">
              Your data is protected with JWT authentication. Each user sees only their own inventory.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-4 sm:px-8 max-w-3xl mx-auto w-full text-center">
        <div className="p-8 rounded-[10px] bg-[#F1F0EA] border border-[#D3D1C8]">
          <h2 className="text-3xl font-bold text-[#14110F] mb-4">Try the Demo</h2>
          <p className="text-[#5C5750] mb-6">
            Want to see it in action? Login with our demo account and explore the features.
          </p>
          <div className="inline-flex flex-col gap-2 p-4 rounded-[8px] bg-white border border-[#D3D1C8] text-left">
            <div className="text-xs font-mono text-[#5C5750]">
              <span className="font-semibold text-[#14110F]">Email:</span> demo@resolva.com
            </div>
            <div className="text-xs font-mono text-[#5C5750]">
              <span className="font-semibold text-[#14110F]">Password:</span> demo123
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 px-6 py-2.5 rounded-[10px] bg-[#14110F] hover:bg-black text-[#F1F0EA] text-sm font-semibold transition-colors cursor-pointer"
          >
            Login to Demo
          </button>
        </div>
      </section>
    </div>
  );
}
