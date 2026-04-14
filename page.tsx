'use client';

import { useEffect, useRef, useState } from 'react';
import { GameStateManager, Player, Ball, Environment, StoryDialogue, saveGame, loadGame } from '@/lib/game';

export default function GamePage() {
  const [gameState, setGameState] = useState<'title' | 'playing'>('title');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const [bgError, setBgError] = useState(false);
  const [bgColor, setBgColor] = useState('');

  const handleBgError = () => {
    console.warn("Failed to fetch background image. Falling back to random colored box.");
    setBgError(true);
    setBgColor(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
  };

  // Draw fallback background on the background canvas if image fails
  useEffect(() => {
    if (gameState === 'title' && bgError && bgCanvasRef.current) {
      const canvas = bgCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [gameState, bgError, bgColor]);

  // Main Game Loop (Empty for now, as requested)
  useEffect(() => {
    if (gameState === 'playing' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationFrameId: number;

      const gameLoop = (timestamp: number) => {
        // Clear canvas for the new frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // --- GAME LOGIC GOES HERE ---
        // e.g., gameStateManager.update(deltaTime);
        // e.g., gameStateManager.draw(ctx);
        
        // Draw a placeholder text so we know the canvas is working
        ctx.fillStyle = 'white';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Game Canvas Active', canvas.width / 2, canvas.height / 2);
        ctx.fillText('Game Loop Running via requestAnimationFrame', canvas.width / 2, canvas.height / 2 + 40);

        // Request next frame
        animationFrameId = requestAnimationFrame(gameLoop);
      };

      // Start the loop
      animationFrameId = requestAnimationFrame(gameLoop);

      // Cleanup
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [gameState]);

  return (
    <div className="relative w-full h-screen bg-[#050a0f] text-[#e0f7fa] overflow-hidden font-sans">
      
      {/* --- TITLE SCREEN --- */}
      {gameState === 'title' && (
        <>
          {/* Background Image Logic */}
          {!bgError ? (
            <img 
              src="https://waterway.checkers.page/background.png" 
              alt="Game Background" 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              onError={handleBgError}
            />
          ) : (
            <canvas
              ref={bgCanvasRef}
              width={1920}
              height={1080}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
          )}

          {/* Title UI */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]">
            <div className="text-center mb-10">
              <h1 className="text-[82px] uppercase tracking-[12px] text-[#00d2ff] drop-shadow-[0_0_20px_rgba(0,210,255,0.5)] mb-1">
                WATERWAY
              </h1>
              <p className="text-[14px] tracking-[4px] opacity-70 uppercase max-w-lg mx-auto">
                A semi-3D top-down soccer game featuring water droplets and an ice ball.
              </p>
            </div>

            <div className="bg-[#0a192f]/85 border border-[#00d2ff]/30 p-[30px] rounded-[4px] w-[320px] flex flex-col gap-[12px]">
              <button 
                onClick={() => setGameState('playing')}
                className="bg-[#00d2ff] border border-[#00d2ff] text-[#050a0f] font-bold px-[20px] py-[12px] text-[13px] uppercase tracking-[2px] cursor-pointer transition-all duration-200 hover:bg-[#00d2ff] hover:text-[#050a0f]"
              >
                Play
              </button>
              
              <button className="bg-transparent border border-[#00d2ff]/30 text-[#e0f7fa] px-[20px] py-[12px] text-[13px] uppercase tracking-[2px] cursor-pointer transition-all duration-200 hover:bg-[#00d2ff] hover:text-[#050a0f] hover:border-[#00d2ff]">
                Local Play
              </button>
              
              <button disabled className="bg-transparent border border-[#00d2ff]/30 text-[#e0f7fa] px-[20px] py-[12px] text-[13px] uppercase tracking-[2px] cursor-not-allowed opacity-30 grayscale transition-all duration-200">
                Online Play (Locked)
              </button>
              
              <button className="bg-transparent border border-[#00d2ff]/30 text-[#e0f7fa] px-[20px] py-[12px] text-[13px] uppercase tracking-[2px] cursor-pointer transition-all duration-200 hover:bg-[#00d2ff] hover:text-[#050a0f] hover:border-[#00d2ff]">
                Settings
              </button>
              
              <button className="bg-transparent border border-[#4285F4] text-[#4285F4] px-[20px] py-[12px] text-[13px] uppercase tracking-[2px] cursor-pointer transition-all duration-200 hover:bg-[#00d2ff] hover:text-[#050a0f] hover:border-[#00d2ff] flex items-center justify-center gap-3 mt-[10px]">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </button>
            </div>

            <div className="absolute bottom-5 text-[10px] opacity-40 tracking-[1px] uppercase">
              BUILD v0.1.0-ALPHA | PHYSICS: CIRCULAR COLLISION | REFILL STATIONS: ACTIVE
            </div>
          </div>
        </>
      )}

      {/* --- GAME CANVAS --- */}
      {gameState === 'playing' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#050a0f]">
          <canvas 
            ref={canvasRef}
            width={1024}
            height={768}
            className="w-full h-full absolute top-0 left-0 block"
          />
          
          <button 
            onClick={() => setGameState('title')}
            className="absolute top-6 left-6 bg-transparent border border-[#00d2ff]/30 text-[#e0f7fa] px-[20px] py-[12px] text-[13px] uppercase tracking-[2px] cursor-pointer transition-all duration-200 hover:bg-[#00d2ff] hover:text-[#050a0f] hover:border-[#00d2ff] z-20"
          >
            ← Back to Title
          </button>
        </div>
      )}
    </div>
  );
}
