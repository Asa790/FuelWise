'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="relative animate-bounce-in">
          <div className="absolute inset-0 bg-brand-primary/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-0 bg-brand-primary/30 rounded-full animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.2s' }} />
          <img
            src="/fuelwise.png"
            alt="FuelWise"
            className="relative w-20 h-20 animate-[spin_3s_linear_infinite]"
          />
        </div>
        <p className="text-sm font-semibold text-text-primary animate-slide-up">FuelWise</p>
        <div className="flex gap-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
