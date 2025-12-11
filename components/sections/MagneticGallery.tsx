'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import DecayText from '@/components/ui/DecayText';

const projects = [
  {
    title: "Footify Landing Page",
    category: "Full Stack",
    image: "/images/footifyLandingPage.png",
    description: "A landing page for our football statistics app.",
    year: "2024",
    link: "https://footify.hu"
  },
  {
    title: "Footify App",
    category: "Full Stack",
    image: "/images/placeholders/project_thumb_beta.png",
    description: "A mobile- and web app for football statistics.",
    year: "2024",
    link: "https://github.com/gaspardani87/Footify"
  },
  {
    title: "ELTE University",
    category: "Study",
    image: "/images/elteLogo.png",
    description: "BSc in Computer Science, Specializing in Software Engineering",
    year: "2025-Now",
    link: "https://elte.hu"
  },
    {
    title: "Petőfi Sándor Technical School, Aszod",
    category: "Study",
    image: "/images/placeholders/study_thumb_bme.png",
    description: "Specialize in Software Development and Testing",
    year: "2020-2025",
    link: "https://vac-petofi.www.intezmeny.edir.hu/"
  }
];

function Card({ project, index }: { project: any, index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  
  // 1. Mouse Tilt Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  
  // Rotation
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  
  // Magnetic Translation (The "Pull" effect)
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], [-10, 10]);

  // 2. Parallax Zoom Physics (Scroll-linked)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]); 
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]); 

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className="group/card relative w-full perspective-1000 will-change-transform"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#111] border border-white/5 transition-all duration-300 group-hover/card:border-accent/50 group-hover/card:shadow-2xl"
      >
        {/* Parallax Image */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
             <motion.div 
                style={{ scale }} 
                className="w-full h-full"
             >
                 <Image 
                    src={project.image} 
                    alt={project.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover/card:scale-110 group-hover/card:grayscale-0 grayscale opacity-70 group-hover/card:opacity-100"
                 />
             </motion.div>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 p-8 flex flex-col justify-between bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover/card:opacity-100 transition-opacity">
            <div className="flex justify-between items-start">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-mono text-accent">
                    {project.category}
                </span>
            </div>
            
            <div className="transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
                <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                    {project.title}
                    <ArrowUpRight className="w-5 h-5 text-accent opacity-0 group-hover/card:opacity-100 -translate-x-2 group-hover/card:translate-x-0 transition-all" />
                </h3>
                <p className="text-gray-400 text-sm max-w-[90%] opacity-0 group-hover/card:opacity-100 transition-opacity delay-100">
                    {project.description}
                </p>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MagneticGallery() {
  const [filter, setFilter] = useState<'all' | 'PROJECT' | 'STUDY'>('all');
  
  // 3. Velocity Skew Physics
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const skewY = useTransform(smoothVelocity, [-2000, 2000], [-5, 5]); // Subtle skew based on speed
  
  const filteredProjects = projects.filter(p => {
      if (filter === 'all') return true;
      if (filter === 'PROJECT') return p.category !== 'Study';
      if (filter === 'STUDY') return p.category === 'Study';
      return true;
  });

  return (
    <section ref={containerRef} className="py-32 w-full relative z-10 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-6">
         <div>
            <DecayText 
                text="Selected Works" 
                highlightWords={["Works"]}
                className="text-5xl md:text-8xl font-bold text-white justify-start mb-6" 
            />
         </div>

         {/* Filter Toggle */}
         <div className="flex bg-white/5 border border-white/10 rounded-full p-1 backdrop-blur-sm">
            {['all', 'PROJECT', 'STUDY'].map((f) => (
                <button 
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 uppercase tracking-wider ${filter === f ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                >
                    {f === 'all' ? 'All' : f === 'PROJECT' ? 'Dev' : 'Study'}
                </button>
            ))}
         </div>
      </div>

      {/* Grid with Focus Blur Effect */}
      {/* "group/gallery" enables the focus blur logic: when hovering the container, unrelated items blur */}
      <motion.div 
        style={{ skewY }}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 group/gallery will-change-transform"
      >
        {filteredProjects.map((project, i) => (
            <div 
                key={`${project.title}-${i}`} 
                className={`
                    transition-all duration-500
                    group-hover/gallery:blur-[2px] 
                    group-hover/gallery:scale-[0.98] 
                    hover:!blur-none 
                    hover:!scale-100 
                    hover:!z-10
                    ${i % 2 === 1 ? 'md:translate-y-24' : ''} // Staggered Grid Layout
                `}
            >
                <Card project={project} index={i} />
            </div>
        ))}
      </motion.div>
    </section>
  );
}
