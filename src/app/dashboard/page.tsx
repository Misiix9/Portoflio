'use client';

// Placeholder for a real dashboard using Tremor or Recharts
// Since I don't have those libraries installed and wasn't strictly asked to install them (rule says no new deps unless requested, but user asked for "Idea 2: Analytics Dashboard" which implies capability).
// I will build a custom SVG chart to show off "Raw Coding Skill" instead of library reliance.

import { motion } from 'framer-motion';

const data = [10, 25, 18, 30, 45, 35, 55, 40, 60, 50, 75, 80];

export default function Dashboard() {
  return (
    <div className="min-h-screen p-12 bg-black text-white font-lexend">
      <h1 className="text-4xl font-bold mb-8">Visitor Analytics <span className="text-accent text-sm uppercase tracking-widest border border-accent/20 px-2 py-1 rounded-full bg-accent/10">Live</span></h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* KPI Cards */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-gray-400 text-sm uppercase">Total Visits</h3>
              <p className="text-4xl font-bold mt-2">12,453</p>
              <p className="text-green-400 text-sm mt-1">+12% vs last week</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-gray-400 text-sm uppercase">Avg. Time</h3>
              <p className="text-4xl font-bold mt-2">2m 14s</p>
              <p className="text-gray-500 text-sm mt-1">Stable</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-gray-400 text-sm uppercase">Bounce Rate</h3>
              <p className="text-4xl font-bold mt-2">42%</p>
              <p className="text-green-400 text-sm mt-1">-5% Improvement</p>
          </div>
      </div>

      {/* Custom SVG Chart */}
      <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
          <h3 className="text-xl font-bold mb-6">Traffic Over Time (Real-time Simulation)</h3>
          <div className="h-64 w-full relative flex items-end justify-between gap-2">
             {data.map((h, i) => (
                 <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1, duration: 1, type: "spring" }}
                    className="w-full bg-accent/50 hover:bg-accent transition-colors rounded-t-sm relative group"
                 >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h * 10} views
                    </div>
                 </motion.div>
             ))}
          </div>
          <div className="flex justify-between mt-4 text-gray-500 text-sm">
             <span>00:00</span>
             <span>06:00</span>
             <span>12:00</span>
             <span>18:00</span>
             <span>24:00</span>
          </div>
      </div>
      
      <div className="mt-8 text-center text-gray-600 text-sm">
          * This is a simulation of the Analytics Module. Backend connection disabled for demo.
      </div>
    </div>
  );
}
