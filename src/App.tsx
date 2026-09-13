import React, { useState } from 'react';
import { ActiveTab, PlayerStats } from './types';
import { Navbar } from './components/Navbar';
import { GameView } from './components/GameView';
import { VillageMap } from './components/VillageMap';
import { MissionBoard } from './components/MissionBoard';
import { ChakraArena } from './components/ChakraArena';
import { ShinobiStats } from './components/ShinobiStats';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('game');
  const [currentLevelNum, setCurrentLevelNum] = useState<number>(1);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1, 2, 3]);
  const [muted, setMuted] = useState<boolean>(false);
  const [bgmActive, setBgmActive] = useState<boolean>(false);

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    hp: 3,
    maxHp: 3,
    chakra: 100,
    maxChakra: 100,
    ryo: 350, // Starting ryo to enjoy Ichiraku ramen right away!
    scrolls: 3, // Starting scrolls to unlock first Jutsu upgrade!
    activeBuff: undefined
  });

  const handleSelectLevelFromAnywhere = (lvl: number) => {
    setCurrentLevelNum(lvl);
    setActiveTab('game');
  };

  return (
    <div className="min-h-screen bg-[#090e17] text-[#dee2ef] flex flex-col selection:bg-[#ff6a00] selection:text-white">
      {/* Top Tactical Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        playerStats={playerStats}
        muted={muted}
        setMuted={setMuted}
        bgmActive={bgmActive}
        setBgmActive={setBgmActive}
        currentLevelNum={currentLevelNum}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full pb-8">
        {activeTab === 'game' && (
          <GameView
            currentLevelNum={currentLevelNum}
            setCurrentLevelNum={setCurrentLevelNum}
            playerStats={playerStats}
            setPlayerStats={setPlayerStats}
            unlockedLevels={unlockedLevels}
            setUnlockedLevels={setUnlockedLevels}
          />
        )}

        {activeTab === 'map' && (
          <VillageMap
            onSelectLevel={handleSelectLevelFromAnywhere}
            onOpenRamen={() => setActiveTab('ramen')}
          />
        )}

        {activeTab === 'missions' && (
          <MissionBoard
            playerStats={playerStats}
            setPlayerStats={setPlayerStats}
          />
        )}

        {activeTab === 'arena' && (
          <ChakraArena />
        )}

        {activeTab === 'ramen' && (
          <ShinobiStats
            playerStats={playerStats}
            setPlayerStats={setPlayerStats}
            onGoToGame={() => setActiveTab('game')}
          />
        )}
      </main>

      {/* Footer Banner */}
      <footer className="w-full border-t border-slate-800/80 bg-[#080d1a] py-3 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[10px] text-[#ff6a00]">NARUTO: SHINOBI ODYSSEY</span>
            <span>•</span>
            <span>Retro 16-Bit Web Audio & Canvas Engine</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Press <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono text-[10px]">P</kbd> to Pause • <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono text-[10px]">R</kbd> to Restart
          </div>
        </div>
      </footer>
    </div>
  );
}
