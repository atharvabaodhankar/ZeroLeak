import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SystemIntegrity } from './SystemIntegrity';
import { Shield } from 'lucide-react';

export function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-primary/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-900/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-900/10 blur-[100px]" />
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.05] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="ZeroLeak Logo" 
                  className="h-10 w-10 object-contain drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]" 
                />
              </div>
              <div className="ml-2">
                <h1 className="text-lg font-bold tracking-tight text-white leading-none">ZEROLEAK</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Decentralized Paper Security</p>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-6 py-8">
          {children}
        </main>
      </div>

      <SystemIntegrity />
    </div>
  );
}
