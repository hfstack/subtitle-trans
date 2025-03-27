"use client";

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Head from 'next/head';

type MainLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, title = '字幕工具箱' }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title}</title>
        <meta name="description" content="字幕处理工具箱 - 修复、添加表情、翻译和转语音" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout; 