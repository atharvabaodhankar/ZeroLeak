import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function ProgressBar({ progress, className, label }) {
  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <div className="flex justify-between text-xs font-medium text-slate-400 uppercase tracking-widest">
          <span>{label}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 border border-white/5">
        <motion.div
          className="h-full bg-cyan-500 relative"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
           <motion.div 
            className="absolute inset-0 bg-white/20"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
