import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, X, Copy, Check, Clock, ShieldCheck } from 'lucide-react';

export const CallModal: React.FC = () => {
  const { callingTarget, closeCallModal, addToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!callingTarget) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(callingTarget.phone);
    setCopied(true);
    addToast('Phone number copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden p-6 text-center animate-in fade-in zoom-in-95 duration-150">
        
        <button
          onClick={closeCallModal}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4">
          <Phone className="w-7 h-7" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
          {callingTarget.role}
        </span>

        <h3 className="text-lg font-extrabold text-slate-900">
          {callingTarget.name}
        </h3>

        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
          <p className="text-xs text-slate-500">Contact Number</p>
          <p className="text-lg font-black text-slate-900 tracking-wider tabular-nums mt-0.5">
            {callingTarget.phone}
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 mt-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Working hours: {callingTarget.hours}</span>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Number'}</span>
          </button>

          <a
            href={`tel:${callingTarget.phone.replace(/[^0-9+]/g, '')}`}
            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Phone className="w-4 h-4" />
            <span>Call Now</span>
          </a>
        </div>

      </div>
    </div>
  );
};
