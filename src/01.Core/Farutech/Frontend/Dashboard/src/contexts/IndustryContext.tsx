import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IndustryMode } from '@/types/dashboard';

interface IndustryContextType {
  industry: IndustryMode;
  setIndustry: (industry: IndustryMode)
        => void;
  isTransitioning: boolean;
}

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

export function IndustryProvider({ children }: { children: ReactNode }) {
  const [industry, setIndustryState] = useState<IndustryMode>('erp');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setIndustry = (newIndustry: IndustryMode)
        => {
    if (newIndustry !== industry) {
      setIsTransitioning(true);
      setTimeout(()
        => {
        setIndustryState(newIndustry);
        setTimeout(()
        => setIsTransitioning(false), 300);
      }, 200);
    }
  };

  useEffect(()
        => {
    document.documentElement.setAttribute('data-industry', industry);
  }, [industry]);

  return (
    <IndustryContext.Provider value={{ industry, setIndustry, isTransitioning }}>
      {children}
    </IndustryContext.Provider>
  );
}

export function useIndustry() {
  const context = useContext(IndustryContext);
  if (context === undefined) {
    throw new Error('useIndustry must be used within an IndustryProvider');
  }
  return context;
}
