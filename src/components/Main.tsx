// Main.tsx
'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation' // Add this import
import Image from 'next/image'

interface Main {
  isLoading: boolean;
  selectedGame: string;
  onGameSelect: (game: string) => void;
}

const Main: React.FC<Main> = ({ isLoading, selectedGame, onGameSelect }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
 
  const router = useRouter(); // Add this




  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleGameSelect = (game: string) => {
    addLog(`Button clicked for game: ${game}`);
    try {
      onGameSelect(game);
      addLog('Game select processed ✓');
      addLog('Attempting navigation to game page...');
      router.push(`/${game}`); // Add explicit navigation
      addLog('Navigation initiated ✓');
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  };

  return (
    <div className="bg-[url('/bg/BG.png')] text-white min-h-screen w-full">
      
      <div className="flex items-center justify-between rounded-xl border border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-transparent p-3">
      <Image
              src="/gameimg/atlas.png"
              alt="Atlas"
              width={40}
              height={40}
              className="rounded-lg"
            />
        <div className="flex items-center gap-3">
          <span className="font-medium tracking-wide font-pop text-[14px]"> Block Puzzle</span>
        </div>
        <button 
          className="h-8 border-l border-pink-500/20 px-4 text-xs font-medium tracking-wider text-pink-500"
          onClick={() => handleGameSelect("unity2")}
          disabled={isLoading}
        >
          PLAY
        </button>
      </div>

      {/* Debug Logs */}
  
    </div>
  );
};

export default Main;