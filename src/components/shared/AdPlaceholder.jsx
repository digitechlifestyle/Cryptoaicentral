import React from 'react';
import { DollarSign } from 'lucide-react';

export default function AdPlaceholder({ type = 'square' }) {
  const styles = {
    square: 'h-64',
    horizontal: 'h-24',
    vertical: 'h-[600px]', // Increased height for better display
  };

  return (
    <div className={`w-full bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-4 ${styles[type]}`}>
      <DollarSign className="w-8 h-8 text-slate-400 mb-2" />
      <p className="text-slate-500 font-semibold text-sm">Advertisement</p>
      <p className="text-slate-400 text-xs text-center mt-1">
        This is a static ad slot.
      </p>
    </div>
  );
}