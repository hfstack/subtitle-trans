"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubtitleContextType {
  subtitleContent: string;
  setSubtitleContent: (content: string) => void;
}

const SubtitleContext = createContext<SubtitleContextType | undefined>(undefined);

export const SubtitleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subtitleContent, setSubtitleContent] = useState<string>('');

  return (
    <SubtitleContext.Provider value={{ subtitleContent, setSubtitleContent }}>
      {children}
    </SubtitleContext.Provider>
  );
};

export const useSubtitleContext = (): SubtitleContextType => {
  const context = useContext(SubtitleContext);
  if (context === undefined) {
    throw new Error('useSubtitleContext must be used within a SubtitleProvider');
  }
  return context;
}; 