'use client';

import { Github, Linkedin, Instagram } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="relative z-10 w-full border-t border-white/10 bg-black py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-white tracking-tighter">SELORA</h3>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} {t('rights')}</p>
        </div>

        <div className="flex items-center gap-6">
           <a href="https://github.com/Misiix9" target="_blank" rel="noopener noreferrer" aria-label={t('github')} className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
             <Github className="w-5 h-5" />
           </a>
           <a href="https://www.linkedin.com/in/gy%C5%91ri-mih%C3%A1ly-7161102bb/" target="_blank" rel="noopener noreferrer" aria-label={t('linkedin')} className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
             <Linkedin className="w-5 h-5" />
           </a>
           <a href="https://instagram.com/gyr.misi" target="_blank" rel="noopener noreferrer" aria-label={t('instagram')} className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
             <Instagram className="w-5 h-5" />
           </a>
        </div>
      </div>
    </footer>
  );
}
