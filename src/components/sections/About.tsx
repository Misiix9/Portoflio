'use client';

import { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { MapPin, Database, Layout, Server, Code, Palette, Terminal, Clock, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Music, Calendar, Github, ExternalLink } from 'lucide-react';
import { useGitHubActivity } from '@/hooks/useGitHubActivity';
import { useSpotifyPlayback } from '@/hooks/useSpotifyPlayback';
import { useNextAvailability } from '@/hooks/useNextAvailability';

export default function About() {
  const t = useTranslations('Home');

  // Live time state
  const [budapestTime, setBudapestTime] = useState('');
  const [visitorTime, setVisitorTime] = useState('');
  const [visitorTimezone, setVisitorTimezone] = useState('');

  useEffect(() => {
    const updateTimes = () => {
      // Budapest time (Europe/Budapest timezone)
      const budapest = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Europe/Budapest',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setBudapestTime(budapest);

      // Visitor's local time
      const visitor = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setVisitorTime(visitor);

      // Get visitor's timezone abbreviation
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setVisitorTimezone(tz.split('/').pop()?.replace('_', ' ') || 'Local');
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  // Switchable card state (0 = GitHub, 1 = Spotify, 2 = Calendar)
  const [activeInfoCard, setActiveInfoCard] = useState(0);

  // Expanded state for About section
  const [isExpanded, setIsExpanded] = useState(false);

  // Live data hooks
  const githubData = useGitHubActivity();
  const spotifyData = useSpotifyPlayback();
  const availabilityData = useNextAvailability();

  // Extended Tech Stack Data
  const techStack = [
    { category: "Frontend", items: [
        { name: "Next.js", icon: <Layout className="w-4 h-4" />, color: "text-blue-400 bg-blue-500/10" },
        { name: "React", icon: <Code className="w-4 h-4" />, color: "text-cyan-400 bg-cyan-500/10" },
        { name: "Tailwind", icon: <Palette className="w-4 h-4" />, color: "text-sky-400 bg-sky-500/10" },
        { name: "Framer", icon: <Layout className="w-4 h-4" />, color: "text-purple-400 bg-purple-500/10" },
    ]},
    { category: "Backend", items: [
        { name: "Node.js", icon: <Server className="w-4 h-4" />, color: "text-green-400 bg-green-500/10" },
        { name: "PostgreSQL", icon: <Database className="w-4 h-4" />, color: "text-indigo-400 bg-indigo-500/10" },
        { name: "Firebase", icon: <Database className="w-4 h-4" />, color: "text-yellow-400 bg-yellow-500/10" },
    ]},
    { category: "Tools", items: [
        { name: "TypeScript", icon: <Code className="w-4 h-4" />, color: "text-blue-500 bg-blue-600/10" },
        { name: "Git", icon: <Terminal className="w-4 h-4" />, color: "text-orange-400 bg-orange-500/10" },
        { name: "Figma", icon: <Palette className="w-4 h-4" />, color: "text-pink-400 bg-pink-500/10" },
    ]}
  ];

  return (
    <section id="about" className="py-24 container mx-auto px-6 max-w-5xl">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1. Profile Photo (1 Col) */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             onMouseEnter={() => setIsExpanded(true)}
             onMouseLeave={() => setIsExpanded(false)}
             className="md:col-span-1 relative rounded-3xl overflow-hidden min-h-[380px] md:min-h-[340px] group border border-white/5 order-1 cursor-pointer"
          >
              <Image 
                 src="/images/image.jpg"
                 alt="Profile"
                 fill
                 className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                 sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
              
              <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-medium text-white/80 backdrop-blur-md bg-black/30 px-2 py-1 rounded-full border border-white/10">
                          Available for work
                      </span>
                  </div>
              </div>
          </motion.div>

          {/* 2. Bio & Stats (2 Cols) */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="md:col-span-2 bg-[#111] border border-white/5 p-4 rounded-3xl flex flex-col gap-4 group hover:border-white/10 transition-colors h-fit order-2"
            >
              <div>
                   <div className="flex justify-between items-start mb-2">
                       <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">About Me</p>
                       <span className="text-xs text-gray-600 font-mono">EST. 2023</span>
                   </div>
                   <h3 className="text-3xl font-bold text-white leading-tight mb-3">
                       I build pixels with <span className="text-accent">purpose</span>.
                   </h3>
                   <p className="text-gray-400 text-sm leading-relaxed text-balance">
                       I'm Mihály, a Full Stack Engineer who bridges the gap between design and engineering. I don't just write code; I craft digital experiences that are fast, accessible, and visually stunning. My focus is on React ecosystems and high-performance animations.
                   </p>
                   {/* Personal Interests */}
                   <p className="text-gray-500 text-xs mt-3 pt-3 border-t border-white/5">
                       🎮 Strategy &amp; FPS &nbsp;|&nbsp; 📚 Business &amp; Fantasy &nbsp;|&nbsp; 🎵 Hardstyle • Techno • Hip-Hop &nbsp;|&nbsp; ☕ Coffee addict &nbsp;|&nbsp; 🦉 Night owl &nbsp;|&nbsp; 🐧 BTW, I use Arch
                   </p>
                   
                   {/* More Toggle Button - Mobile Only */}
                   <button 
                     onClick={() => setIsExpanded(!isExpanded)}
                     className="md:hidden flex items-center gap-1 text-accent text-xs hover:text-accent/80 transition-colors mt-2 group/more"
                   >
                     <span>{isExpanded ? 'Less' : 'More'}</span>
                     {isExpanded ? (
                       <ChevronUp className="w-3 h-3 group-hover/more:-translate-y-0.5 transition-transform" />
                     ) : (
                       <ChevronDown className="w-3 h-3 group-hover/more:translate-y-0.5 transition-transform" />
                     )}
                   </button>
                   
                   {/* Extended Text - Only visible when expanded */}
                   <AnimatePresence>
                     {isExpanded && (
                       <motion.p 
                         initial={{ opacity: 0, height: 0 }}
                         animate={{ opacity: 1, height: 'auto' }}
                         exit={{ opacity: 0, height: 0 }}
                         transition={{ duration: 0.3, ease: 'easeInOut' }}
                         className="text-gray-500 text-xs mt-2 overflow-hidden"
                       >
                         Outside of work, you&apos;ll find me deep in strategy games plotting my next move, or in the middle of an intense FPS session. I balance screen time with reading—business books to sharpen my entrepreneurial edge, and fantasy novels to fuel my imagination. My playlist is a wild mix: hardstyle and techno for those late-night coding sprints, hip-hop to keep the energy up, and lo-fi when I need to zone in. I also maintain Arch Linux scripts on GitHub, because yes, I use Arch.
                       </motion.p>
                     )}
                   </AnimatePresence>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                  <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors group/stat relative cursor-pointer">
                      <h4 className="text-2xl font-bold text-white">5+</h4>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500">Years Exp</p>
                      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-accent whitespace-nowrap opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300">(Since Studying)</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors">
                      <a href="https://github.com/Misiix9" target="_blank" rel="noreferrer">
                          <h4 className="text-2xl font-bold text-white">10+</h4>
                          <p className="text-[10px] uppercase tracking-wider text-gray-500">Projects</p>
                      </a>
                  </div>
                   <div className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors">
                      <h4 className="text-2xl font-bold text-white">100%</h4>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500">Committed</p>
                  </div>
              </div>
          </motion.div>

                     {/* 3. Extended Tech Stack (2 Cols) */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className={`grid-tech md:col-span-2 bg-[#111] border border-white/5 p-6 rounded-3xl flex flex-col gap-4 group hover:border-white/10 transition-colors ${isExpanded ? 'order-3' : 'order-4'}`}
          >
              <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Tech Arsenal</h4>
                  <Code className="w-4 h-4 text-gray-600" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {techStack.map((group, i) => (
                      <div key={i} className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 mb-2 pl-1">{group.category}</p>
                          <div className="flex flex-col gap-2">
                              {group.items.map((tech, j) => (
                                  <div key={j} className={`flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-default`}>
                                      {tech.icon}
                                      <span className={`text-xs font-medium ${tech.color.split(" ")[0]}`}>{tech.name}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </motion.div>

          {/* 4. Location & Info Card Wrapper (1 Col) - stays together */}
          <div className={`md:col-span-1 flex flex-col gap-3 ${isExpanded ? 'order-4' : 'order-3'}`}>
            {/* Location Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#111] border border-white/5 p-4 rounded-3xl flex flex-col gap-3 group hover:border-white/10 transition-colors"
            >
               {/* Location Header with Pulsing Dot */}
               
               <div className="flex items-start justify-between">
                   <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <MapPin className="w-4 h-4 text-accent" />
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            </div>
                            <h4 className="text-white font-bold text-sm">Budapest</h4>
                        </div>
                        <p className="text-gray-500 text-xs pl-6">Based in Hungary 🇭🇺</p>
                   </div>
                   {/* Live Local Time */}
                   <div className="p-2 rounded-lg bg-white/5 text-xs text-white font-mono flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-accent" />
                        {budapestTime || '--:--'}
                   </div>
               </div>

                <div className="h-px w-full bg-white/5" />
                
               <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Language</span>
                        <span className="text-white">HU / EN / ES</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Relocation</span>
                        <span className="text-white">Available</span>
                    </div>
                    {/* Response Time */}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Avg. reply</span>
                        <span className="text-green-400">{'< 24h'}</span>
                    </div>
                </div>
               
            </motion.div>

            {/* Switchable Info Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="hidden md:flex md:flex-col bg-[#111] border border-white/5 px-4 py-2 rounded-2xl group/card hover:border-white/10 transition-colors h-[87px] relative overflow-hidden"
            >
               {/* Navigation Arrows - appear on hover */}
               <button 
                 onClick={() => setActiveInfoCard((prev) => (prev === 0 ? 2 : prev - 1))}
                 className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/10 text-white opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-white/20 z-10"
               >
                 <ChevronLeft className="w-4 h-4" />
               </button>
               <button 
                 onClick={() => setActiveInfoCard((prev) => (prev === 2 ? 0 : prev + 1))}
                 className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/10 text-white opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-white/20 z-10"
               >
                 <ChevronRight className="w-4 h-4" />
               </button>

               {/* Content based on active card */}
               <div className="flex-1 flex items-center overflow-hidden">
                 {activeInfoCard === 0 && (
                   /* GitHub Activity - 4 weeks grid */
                   <div className="flex items-center gap-3 w-full">
                     <Github className="w-5 h-5 text-gray-400 shrink-0" />
                     <div className="flex-1">
                       <div className="grid grid-cols-7 gap-0.5">
                         {(githubData.levels.length >= 28 ? githubData.levels : Array(28).fill(0)).map((level, i) => (
                           <div 
                             key={i} 
                             className={`w-2 h-2 rounded-sm ${
                               level === 3 ? 'bg-green-500' 
                               : level === 2 ? 'bg-green-500/50' 
                               : level === 1 ? 'bg-green-500/20'
                               : 'bg-white/10'
                             }`}
                             title={`Day ${i + 1}`}
                           />
                         ))}
                       </div>
                     </div>
                     <div className="text-right shrink-0">
                       <span className="text-xs text-white font-medium">
                         {githubData.isLoading ? '...' : githubData.totalCommits}
                       </span>
                       <span className="text-[10px] text-gray-500 block">commits</span>
                     </div>
                   </div>
                 )}

                 {activeInfoCard === 1 && (
                   /* Spotify - With artist, progress bar, and open button */
                   <div className="flex items-center gap-2 w-full">
                     {spotifyData.albumArt ? (
                       <img 
                         src={spotifyData.albumArt} 
                         alt="Album art" 
                         className="w-10 h-10 rounded shrink-0 object-cover"
                       />
                     ) : (
                       <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center shrink-0">
                         <Music className={`w-5 h-5 ${spotifyData.isPlaying ? 'text-green-500' : 'text-gray-400'}`} />
                       </div>
                     )}
                     <div className="flex-1 min-w-0">
                       {spotifyData.url ? (
                         <a 
                           href={spotifyData.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center gap-1 group/title"
                         >
                           <p className="text-white text-xs font-medium truncate group-hover/title:text-white/80 group-hover/title:underline transition-colors">
                             {spotifyData.isLoading ? 'Loading...' : (spotifyData.track || 'Not playing')}
                           </p>
                           <ExternalLink className="w-3 h-3 text-white shrink-0 group-hover/title:text-white/80 transition-colors" />
                         </a>
                       ) : (
                         <p className="text-white text-xs font-medium truncate">
                           {spotifyData.isLoading ? 'Loading...' : (spotifyData.track || 'Not playing')}
                         </p>
                       )}
                       {spotifyData.artist && (
                         <p className="text-gray-500 text-[10px] truncate">{spotifyData.artist}</p>
                       )}
                       {spotifyData.progressMs !== null && spotifyData.durationMs && (
                         <div className="flex items-center gap-1 mt-1">
                           <span className="text-[9px] text-gray-500 w-6 text-right">
                             {Math.floor(spotifyData.progressMs / 60000)}:{String(Math.floor((spotifyData.progressMs % 60000) / 1000)).padStart(2, '0')}
                           </span>
                           <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-green-500 rounded-full transition-all duration-100 ease-linear"
                               style={{ width: `${(spotifyData.progressMs / spotifyData.durationMs) * 100}%` }}
                             />
                           </div>
                           <span className="text-[9px] text-gray-500 w-6">
                             {Math.floor(spotifyData.durationMs / 60000)}:{String(Math.floor((spotifyData.durationMs % 60000) / 1000)).padStart(2, '0')}
                           </span>
                         </div>
                       )}
                     </div>
                   </div>
                 )}

                 {activeInfoCard === 2 && (
                   /* Availability - Enhanced */
                   <div className="flex items-center gap-3 w-full">
                     <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                       <Calendar className="w-5 h-5 text-accent" />
                     </div>
                     <div className="flex-1">
                       <p className="text-[10px] text-gray-500 uppercase tracking-wide">Next available</p>
                       <p className="text-white text-sm font-medium">
                         {availabilityData.isLoading ? 'Loading...' : availabilityData.nextAvailable}
                       </p>
                     </div>
                     <div className="px-2 py-1 rounded-full bg-green-500/20 shrink-0">
                       <span className="text-[10px] text-green-400 font-medium">Open</span>
                     </div>
                   </div>
                 )}
               </div>

               {/* Navigation Dots - Centered at bottom */}
               <div className="flex justify-center gap-1.5 mt-1">
                 {[0, 1, 2].map((i) => (
                   <button 
                     key={i} 
                     onClick={() => setActiveInfoCard(i)}
                     className={`w-1.5 h-1.5 rounded-full transition-colors ${activeInfoCard === i ? 'bg-accent' : 'bg-white/20 hover:bg-white/40'}`}
                   />
                 ))}
               </div>
            </motion.div>
          </div>
       </div>
    </section>
  );
}
