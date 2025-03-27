"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubtitleContextType {
  subtitleContent: string;
  setSubtitleContent: (content: string) => void;
  subtitleFile: File | null;
  setSubtitleFile: (file: File | null) => void;
  clearSubtitle: () => void;
}

const SubtitleContext = createContext<SubtitleContextType | undefined>(undefined);

export const SubtitleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subtitleContent, setSubtitleContent] = useState<string>('');
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);
  
  const clearSubtitle = () => {
    setSubtitleContent('');
    setSubtitleFile(null);
  };
  
  return (
    <SubtitleContext.Provider value={{ 
      subtitleContent, 
      setSubtitleContent, 
      subtitleFile, 
      setSubtitleFile,
      clearSubtitle
    }}>
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