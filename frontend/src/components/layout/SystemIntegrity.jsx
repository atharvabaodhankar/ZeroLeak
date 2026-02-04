import React from 'react';
import { ShieldCheck, Lock, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

export function SystemIntegrity() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full bg-slate-950/80 px-4 py-2 text-xs font-medium text-emerald-400 backdrop-blur-md border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
    >
      <div className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-500 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
      </div>
      <span className="tracking-widest uppercase">System Secure</span>
      <div className="h-3 w-px bg-slate-800" />
      <div className="flex items-center gap-1.5 text-slate-400">
        <ShieldCheck className="h-3 w-3" />
        <span>AES-256</span>
      </div>
      <div className="h-3 w-px bg-slate-800" />
      <div className="flex items-center gap-1.5 text-slate-400">
        <Lock className="h-3 w-3" />
        <span>TLS 1.3</span>
      </div>
    </motion.div>
  );
}
