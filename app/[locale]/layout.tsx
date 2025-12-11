import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, setRequestLocale } from 'next-intl/server';
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { SoundProvider } from "@/components/providers/SoundProvider";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import MuteButton from "@/components/ui/MuteButton";
import GameWrapper from "@/components/layout/GameWrapper";
import StoryLine from "@/components/ui/StoryLine";
import NeuralCursor from "@/components/ui/NeuralCursor";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://selora.dev'),
  title: {
    default: "Selora | Creative Web Developer & Frontend Engineer | Next.js & Three.js",
    template: "%s | Selora",
  },
  description: "Mihály Győri (Selora) is an award-winning Freelance Web Developer and Frontend Engineer based in Budapest, Hungary. Expert in building high-performance 3D websites, interactive portfolios, and enterprise applications using Next.js 14, React, TypeScript, Tailwind CSS, and WebGL. Available for remote work globally.",
  keywords: [
    // --- Core Identity ---
    "Website Developer", "Web Developer Budapest", "Frontend Engineer", "Full Stack Developer", "React Developer",
    "Creative Developer", "UI/UX Engineer", "Software Engineer", "Senior Frontend Developer", "Lead Web Developer",
    "Mihály Győri", "Selora", "Selora.dev", "Selora Portfolio", "Selora Tech",

    // --- Technology Stack: Core ---
    "Next.js", "Next.js 14", "Next.js Expert", "React.js", "React 18", "TypeScript", "JavaScript", "ES6+", "Node.js",
    "HTML5", "CSS3", "SASS", "SCSS", "Tailwind CSS", "Shadcn UI", "Radix UI", "Zustand", "Redux", "TanStack Query",

    // --- Technology Stack: 3D & Animation ---
    "Three.js", "React Three Fiber", "R3F", "Drei", "WebGL", "GLSL", "Shaders", "Framer Motion", "GSAP", "Lottie",
    "Interactive 3D", "3D Web Design", "Creative Coding", "Canvas API", "Particles.js", "Oogl",

    // --- Services & Specializations ---
    "Custom Website Development", "Portfolio Design", "Landing Page Developer", "E-commerce Developer", "Shopify Developer",
    "Headless CMS", "Sanity CMS", "Strapi", "Contentful", "Startup Website Developer", "SaaS Frontend",
    "Agency Quality Web Design", "Freelance Web Developer", "Remote Web Developer", "Consultant",

    // --- Geo-Location ---
    "Budapest", "Hungary", "Central Europe", "EU Web Developer", "Remote Freelancer", "Global Contractor",
    "Webfejlesztő", "Webfejlesztés Budapest", "Programozó",

    // --- Performance & Best Practices ---
    "SEO Optimization", "Technical SEO", "Core Web Vitals", "Fast Loading Websites", "Accessible Design", "WCAG",
    "Responsive Design", "Mobile First", "PWA", "Progressive Web Apps", "Server Side Rendering", "SSR", "SSG",

    // --- Design Styles ---
    "Modern Web Design", "Minimalist", "Brutalist Web Design", "Awwwards Style", "Premium Web Design",
    "Dark Mode Design", "Glassmorphism", "Neumorphism", "Typographic Design", "Micro-interactions",

    // --- Deployment & DevOps ---
    "Vercel", "Netlify", "AWS", "Docker", "CI/CD", "Git", "GitHub", "GitLab", "VS Code"
  ],
  authors: [{ name: "Mihály Győri", url: "https://selora.dev" }],
  creator: "Mihály Győri",
  publisher: "Selora",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://selora.dev",
  },
  openGraph: {
    title: "Selora | Expert Web Developer & Visual Engineer",
    description: "Need a website that stands out? I build stunning, high-performance web experiences using Next.js and 3D technologies. Elevate your brand today.",
    url: "https://selora.dev",
    siteName: "Selora Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://selora.dev/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Selora - Creative Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Selora | Mihály Győri - Creative Developer",
    description: "Award-winning Web Developer & Designer based in Budapest. Specializing in Next.js & 3D WebGL.",
    creator: "@SeloraDev",
    images: ["https://selora.dev/og-image.jpg"],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};


export function generateStaticParams() {
  return [
    {locale: 'en'},
    {locale: 'hu'}
  ];
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const messages = await getMessages();

  // Structured Data (JSON-LD) for Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
     // ... rest of jsonLd

    "name": "Mihály Győri",
    "alternateName": "Selora",
    "url": "https://selora.dev",
    "image": "https://selora.dev/images/image.jpg",
    "sameAs": [
      "https://github.com/Misiix9",
      "https://instagram.com/misiix9",
      "https://linkedin.com/in/mihalygyori"
    ],
    "jobTitle": "Web Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    },
    "description": "Professional Web Developer specializing in Next.js, React, and 3D interactions.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Budapest",
      "addressCountry": "Hungary"
    }
  };

  return (
    <html lang={locale} className={`${lexend.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground selection:bg-accent selection:text-white" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
           <SoundProvider>
             <SmoothScrollProvider>
               <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
               />
               <ParticlesBackground />
               <NeuralCursor />
               {children}
               <MuteButton />
               <GameWrapper />
               <StoryLine />
             </SmoothScrollProvider>
           </SoundProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
