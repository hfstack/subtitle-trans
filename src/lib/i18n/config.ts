// 支持的语言列表
export const locales = ['zh', 'en'] as const;
// 默认语言
export const defaultLocale = 'zh' as const;

// 不使用导航函数，而是直接从 next-intl/client 导入
// 在需要的组件中直接导入
// import { useRouter, usePathname } from 'next-intl/client';
// import { Link } from 'next-intl/link'; 