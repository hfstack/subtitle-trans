'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // 获取浏览器语言
    const userLang = navigator.language;
    const lang = userLang.startsWith('zh') ? 'zh' : 'en';
    
    // 重定向到相应语言页面
    router.replace(`/${lang}`);
  }, [router]);
  
  return <div>正在重定向...</div>;
}
