"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowToUse from '@/components/home/HowToUse';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Hero />
      <Features />
      <HowToUse />
    </div>
  );
} 