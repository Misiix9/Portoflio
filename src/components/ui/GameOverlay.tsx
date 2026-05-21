'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Bug, Play, RotateCcw } from 'lucide-react';

interface GameOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FallingBug {
  x: number;
  y: number;
  speed: number;
  id: number;
}

export default function GameOverlay({ isOpen, onClose }: GameOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef(0);
  const spawnTimeoutRef = useRef(0);
  const bugsRef = useRef<FallingBug[]>([]);
  const nextIdRef = useRef(0);
  const scoreRef = useRef(0);
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const lastFrameRef = useRef(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const endGame = useCallback(() => {
    setGameOver(true);
    setHighScore((currentHighScore) => Math.max(currentHighScore, scoreRef.current));
  }, []);

  // Game loop logic
  useEffect(() => {
    if (!isOpen || !gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvasSizeRef.current = { width, height };
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnBug = () => {
       const { width } = canvasSizeRef.current;
       const x = Math.random() * Math.max(width - 40, 1) + 20;
       bugsRef.current.push({
         x,
         y: -50,
         speed: 120 + Math.random() * 130 + scoreRef.current * 8,
         id: nextIdRef.current++
       });
    };

    const scheduleSpawn = () => {
      spawnBug();
      const spawnRate = Math.max(220, 1000 - scoreRef.current * 24);
      spawnTimeoutRef.current = window.setTimeout(scheduleSpawn, spawnRate);
    };

    const update = (time: number) => {
      const { width, height } = canvasSizeRef.current;
      const delta = lastFrameRef.current ? Math.min((time - lastFrameRef.current) / 1000, 0.05) : 0.016;
      lastFrameRef.current = time;
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = '#22c55e33';
      ctx.lineWidth = 1;

      // Update and draw bugs
      const bugs = bugsRef.current;
      for (let i = bugs.length - 1; i >= 0; i--) {
        const bug = bugs[i];
        bug.y += bug.speed * delta;

        // Draw bug (Red square or custom shape)
        ctx.fillStyle = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        ctx.rect(bug.x - 15, bug.y - 15, 30, 30);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Game Over condition
        if (bug.y > height) {
          endGame();
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    scheduleSpawn();
    animationFrameRef.current = requestAnimationFrame(update);

    // Click handler to destroy bugs
    const handleClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        let gained = 0;

        bugsRef.current = bugsRef.current.filter(bug => {
            const dist = Math.sqrt(Math.pow(clickX - bug.x, 2) + Math.pow(clickY - bug.y, 2));
            if (dist < 40) { // Hit radius
                gained += 1;
                return false;
            }
            return true;
        });

        if (gained > 0) {
          scoreRef.current += gained;
          setScore(scoreRef.current);
        }
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameRef.current);
      clearTimeout(spawnTimeoutRef.current);
      lastFrameRef.current = 0;
    };
  }, [endGame, gameOver, gameStarted, isOpen]);

  // Reset game
  const startGame = () => {
    bugsRef.current = [];
    nextIdRef.current = 0;
    scoreRef.current = 0;
    lastFrameRef.current = 0;
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
