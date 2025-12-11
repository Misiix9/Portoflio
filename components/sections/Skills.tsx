'use client';

import { motion } from 'framer-motion';
import { Code, Layout, Database, Terminal, Smartphone, Palette } from 'lucide-react';

const skills = [
  { name: 'Web Development', icon: Layout },
  { name: 'App Development', icon: Smartphone },
  { name: 'UI/UX Design', icon: Palette },
  { name: 'Backend', icon: Database },
  { name: 'Algorithms', icon: Code },
  { name: 'DevOps', icon: Terminal },
];

export default function Skills() {
  return (
    <section id="skills" className="min-h-screen container mx-auto px-6 py-24 flex flex-col justify-center">
       <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-4">
          My <span className="text-accent">Skills</span>
        </h2>
        <p className="text-gray-400">Tools and technologies I use to build the future.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            className="group relative flex flex-col items-center justify-center p-8 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-accent/50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
          >
             <div className="absolute inset-0 bg-gradient-to-tr from-accent/0 via-accent/0 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             
             <skill.icon className="w-12 h-12 text-gray-300 group-hover:text-accent transition-colors duration-300 mb-4" />
             <h3 className="text-xl font-semibold text-white group-hover:text-accent transition-colors duration-300">{skill.name}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
