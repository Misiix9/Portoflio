import { setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import About from '@/components/sections/About';

import GlobalReach from '@/components/sections/GlobalReach';
import MagneticGallery from '@/components/sections/MagneticGallery';
import Contact from '@/components/sections/Contact';

export function generateStaticParams() {
  return [
    {locale: 'en'},
    {locale: 'hu'}
  ];
}

export default async function Home({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground selection:bg-accent selection:text-white">
      <Navbar />
      <LanguageSwitcher fixed />
      
      <Hero />
      <About />
      <MagneticGallery />
      <GlobalReach />
      <Contact />

      <Footer />
    </main>
  );
}
