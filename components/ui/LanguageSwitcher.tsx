'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useState, useTransition } from 'react';
import clsx from 'clsx';

export default function LanguageSwitcher({ fixed = false }: { fixed?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isHovered, setIsHovered] = useState(false);

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'hu' : 'en';
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        "flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-black/50 px-4 py-2 backdrop-blur-md transition-colors hover:border-accent hover:bg-accent/10",
        fixed ? "fixed top-8 right-8 z-50" : ""
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Globe className={clsx("w-4 h-4 transition-colors", isHovered ? "text-accent" : "text-gray-400")} />
      
      <div className="relative h-6 w-8 overflow-hidden">
        <motion.span
          className="absolute inset-0 flex items-center justify-center font-bold text-sm uppercase"
          animate={{
            y: locale === 'en' ? 0 : -24,
            opacity: locale === 'en' ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          EN
        </motion.span>
        <motion.span
          className="absolute inset-0 flex items-center justify-center font-bold text-sm uppercase"
          animate={{
            y: locale === 'hu' ? 0 : 24,
            opacity: locale === 'hu' ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          HU
        </motion.span>
      </div>
    </motion.button>
  );
}
