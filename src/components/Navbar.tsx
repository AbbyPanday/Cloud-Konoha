import React from 'react';
import { ActiveTab, PlayerStats } from '../types';
import { sound } from '../game/sound';
import { Volume2, VolumeX, Music, ShieldAlert, Sparkles, Scroll, Coins } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  playerStats: PlayerStats;
  muted: boolean;
  setMuted: (muted: boolean) => void;
  bgmActive: boolean;
  setBgmActive: (active: boolean) => void;
  currentLevelNum: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  playerStats,
  muted,
  setMuted,
  bgmActive,
  setBgmActive,
  currentLevelNum
}) => {
  const handleToggleMute = () => {
    const isMuted = sound.toggleMute();
    setMuted(isMuted);
    if (isMuted) setBgmActive(false);
  };

  const handleToggleBgm = () => {
    if (bgmActive) {
      sound.stopBgm();
      setBgmActive(false);
    } else {
      sound.startBgm();
      setBgmActive(true);
    }
  };

  return (
    <header className="w-full bg-[#0d1424]/90 backdrop-blur-md border-b border-[#1e293b] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Konoha Crest & Title */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full border-2 border-[#ff6a00] p-1 bg-[#1a120b] shadow-[0_0_12px_rgba(255,106,0,0.4)] flex items-center justify-center overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrzMAinITuC7tf4uv3Ijn5ilX8Wjdmm_pG__OVnYcj6TrPgp0VrNKnQPz53e0Mepu9TZPFVav1qBIwCozD2Heg9611hH7p0enypLluLF8bSiItr5HTUHZgo8vJib4JEg1PTI0mTTbAK3TIEXIAMYnloXEgeZzifPBPWUa24JlkH-AHbpO1Eg1uzqOcHYbCfpNEgYIjX7W9amxFh2M_MyOJoFn7STtHTtKAQFlHMfJphw__tLdw8Ts"
              alt="Konoha Crest"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg sm:text-xl font-black text-white tracking-wider">
                NARUTO
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-pixel bg-[#ff6a00]/20 text-[#ff6a00] border border-[#ff6a00]/40">
                SHINOBI ODYSSEY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">10-Boss Epic 16-Bit Campaign</p>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-[#080d1a] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              sound.click();
              setActiveTab('game');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'game'
                ? 'bg-gradient-to-r from-[#ff6a00] to-[#ea580c] text-white shadow-[0_0_12px_rgba(255,106,0,0.5)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🎮</span>
            <span>Campaign</span>
            <span className="text-[10px] px-1 rounded bg-black/30">Lv.{currentLevelNum}</span>
          </button>

          <button
            onClick={() => {
              sound.click();
              setActiveTab('map');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-gradient-to-r from-[#06b6d4] to-[#0284c7] text-white shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🗺️</span>
            <span>Village Map</span>
          </button>

          <button
            onClick={() => {
              sound.click();
              setActiveTab('missions');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'missions'
                ? 'bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>📜</span>
            <span>Missions</span>
          </button>

          <button
            onClick={() => {
              sound.click();
              setActiveTab('arena');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'arena'
                ? 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>⚔️</span>
            <span>Chakra Arena</span>
          </button>

          <button
            onClick={() => {
              sound.click();
              setActiveTab('ramen');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'ramen'
                ? 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🍜</span>
            <span>Stats & Ramen</span>
            {playerStats.activeBuff && (
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            )}
          </button>
        </nav>

        {/* Right: Currency & Sound Controls */}
        <div className="flex items-center gap-3">
          {/* Active Buff Badge */}
          {playerStats.activeBuff && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{playerStats.activeBuff.name}</span>
            </div>
          )}

          {/* Ryo Counter */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1e293b]/70 text-[#fbbf24] text-xs font-bold font-pixel">
            <Coins className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>{playerStats.ryo}</span>
          </div>

          {/* Scrolls Counter */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1e293b]/70 text-[#38bdf8] text-xs font-bold font-pixel">
            <Scroll className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>{playerStats.scrolls}</span>
          </div>

          {/* BGM Toggle */}
          <button
            onClick={handleToggleBgm}
            title="Toggle 8-bit BGM Beat"
            className={`p-1.5 rounded-lg border transition-all ${
              bgmActive
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/40 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Mute Toggle */}
          <button
            onClick={handleToggleMute}
            title="Toggle Audio Effects"
            className={`p-1.5 rounded-lg border transition-all ${
              !muted
                ? 'bg-[#ff6a00]/20 text-[#ff6a00] border-[#ff6a00]/40 shadow-[0_0_8px_rgba(255,106,0,0.4)]'
                : 'bg-red-500/20 text-red-400 border-red-500/40'
            }`}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
