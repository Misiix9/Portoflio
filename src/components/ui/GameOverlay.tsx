'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Bug, Play, RotateCcw } from 'lucide-react';

interface GameOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GameOverlay({ isOpen, onClose }: GameOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Game loop logic
  useEffect(() => {
    if (!isOpen || !gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let spawnInterval: NodeJS.Timeout;
    
    // Game state
    let bugs: { x: number; y: number; speed: number; id: number }[] = [];
    let nextId = 0;
    let spawnRate = 1000;
    let lastTime = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnBug = () => {
       const x = Math.random() * (canvas.width - 40) + 20;
       bugs.push({
         x,
         y: -50,
         speed: 2 + Math.random() * 3 + (score / 10), // Difficulty ramps up
         id: nextId++
       });
       spawnRate = Math.max(200, 1000 - score * 20);
    };

    spawnInterval = setInterval(spawnBug, spawnRate);

    const update = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw standard connection lines (matrix style)
      ctx.strokeStyle = '#22c55e33';
      ctx.lineWidth = 1;

      // Update and draw bugs
      for (let i = bugs.length - 1; i >= 0; i--) {
        const bug = bugs[i];
        bug.y += bug.speed;

        // Draw bug (Red square or custom shape)
        ctx.fillStyle = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        ctx.rect(bug.x - 15, bug.y - 15, 30, 30);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Game Over condition
        if (bug.y > canvas.height) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    // Initial spawn
    spawnBug();

    // Click handler to destroy bugs
    const handleClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        bugs = bugs.filter(bug => {
            const dist = Math.sqrt(Math.pow(clickX - bug.x, 2) + Math.pow(clickY - bug.y, 2));
            if (dist < 40) { // Hit radius
                setScore(s => s + 1);
                // Particle explosion effect could go here
                return false;
            }
            return true;
        });
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      clearInterval(spawnInterval);
      // Clean up intervals if they were dynamic (recurse)
    };
  }, [isOpen, gameStarted, gameOver, score]);

  // Reset game
  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Background Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 cursor-crosshair" />

            {/* UI Layer */}
            <div className="relative z-10 text-center pointer-events-none">
                {!gameStarted && !gameOver && (
                    <div className="bg-black/80 p-8 rounded-2xl border border-green-500/50 backdrop-blur-md pointer-events-auto">
                        <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-green-500 mb-2 font-mono">SYSTEM BREACH DETECTED</h2>
                        <p className="text-gray-400 mb-6">Protocol 86: Defend the server from incoming bugs.</p>
                        <button 
                            onClick={startGame}
                            className="bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-8 rounded-full flex items-center gap-2 mx-auto transition-colors"
                        >
                            <Play size={20} /> INITIALIZE DEFENSE
                        </button>
                    </div>
                )}

                {gameStarted && !gameOver && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2">
                        <div className="text-6xl font-bold text-green-500 font-mono drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
                            {score}
                        </div>
                    </div>
                )}

                {gameOver && (
                    <div className="bg-black/80 p-8 rounded-2xl border border-red-500/50 backdrop-blur-md pointer-events-auto">
                        <Bug className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-red-500 mb-2 font-mono">SYSTEM COMPROMISED</h2>
                        <p className="text-gray-400 mb-6">
                            Final Score: <span className="text-white font-bold">{score}</span><br/>
                            High Score: <span className="text-white font-bold">{highScore}</span>
                        </p>
                        <button 
                            onClick={startGame}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 mx-auto transition-colors"
                        >
                            <RotateCcw size={20} /> REBOOT SYSTEM
                        </button>
                    </div>
                )}
            </div>

            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors z-20 pointer-events-auto"
            >
                <X size={32} />
            </button>

          </motion.div>
        )}
      </AnimatePresence>
  );
}
