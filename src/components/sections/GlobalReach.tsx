'use client';

import React, { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { motion } from 'framer-motion';

export default function GlobalReach() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1], // Gray base (User requested)
      markerColor: [0.9, 0.1, 0.2], // Bright Red for markers (approx #e51a32)
      glowColor: [0.5, 0, 0.1], // Deep Red glow (approx accent)
      markers: [
        { location: [40.7128, -74.0060], size: 0.1 }, // New York
        { location: [51.5074, -0.1278], size: 0.1 }, // London
        { location: [35.6762, 139.6503], size: 0.1 }, // Tokyo
        // Add your location here ideally
        { location: [47.4979, 19.0402], size: 0.1 }, // Budapest, Hungary
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // state.phi = current phi angle
        state.phi = phi;
        phi += 0.003;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <section className="w-full py-24 container mx-auto px-6 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: Content */}
        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
        >
            <h2 className="text-4xl font-bold text-white mb-2">
                Global Reach <br />
                <span className="text-accent">Local Impact.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
                I work with clients worldwide, bridging time zones with efficient communication and remote-first workflows. Whether you're in New York, London, or Tokyo, I'm just a Slack message away.
            </p>
            
            <div className="flex gap-4 mt-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex-1 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-white">100%</h3>
                    <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Remote Ready</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex-1 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-white">24/7</h3>
                    <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Async Work</p>
                </div>
            </div>
        </motion.div>

        {/* Right: Globe */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[500px] w-full flex items-center justify-center"
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl opacity-20" />
            <canvas
                ref={canvasRef}
                style={{ width: 600, height: 600, maxWidth: '100%', aspectRatio: 1 }}
                className="cursor-move grab active:grabbing"
            />
        </motion.div>

      </div>
    </section>
  );
}
