import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/engine';
import { LEVELS } from '../game/levels';
import { LevelConfig, PlayerStats } from '../types';
import { sound } from '../game/sound';
import {
  RotateCcw,
  Play,
  Pause,
  Maximize2,
  Tv,
  ChevronRight,
  Sparkles,
  Trophy,
  Skull,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Flame,
  Zap,
  Users
} from 'lucide-react';

interface GameViewProps {
  currentLevelNum: number;
  setCurrentLevelNum: (num: number) => void;
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
  unlockedLevels: number[];
  setUnlockedLevels: React.Dispatch<React.SetStateAction<number[]>>;
}

export const GameView: React.FC<GameViewProps> = ({
  currentLevelNum,
  setCurrentLevelNum,
  playerStats,
  setPlayerStats,
  unlockedLevels,
  setUnlockedLevels
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [scanlinesActive, setScanlinesActive] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [lastClearedLevel, setLastClearedLevel] = useState<LevelConfig | null>(null);

  const activeLevel = LEVELS.find(l => l.levelNum === currentLevelNum) || LEVELS[0];

  // Initialize Game Engine
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = 960;
    canvas.height = 600;

    const engine = new GameEngine(
      canvas,
      activeLevel,
      {
        onStatsUpdate: stats => {
          setPlayerStats(prev => ({
            ...prev,
            hp: stats.hp,
            maxHp: stats.maxHp,
            chakra: stats.chakra,
            maxChakra: stats.maxChakra,
            ryo: stats.ryo,
            scrolls: prev.scrolls + (stats.scrolls > prev.scrolls ? 1 : 0)
          }));
        },
        onLevelComplete: (lvlNum, _score, scrollsCollected) => {
          setShowClearModal(true);
          setLastClearedLevel(activeLevel);

          // Unlock next level if available
          if (lvlNum < 10 && !unlockedLevels.includes(lvlNum + 1)) {
            setUnlockedLevels(prev => [...prev, lvlNum + 1]);
          }

          // Reward ryo and scrolls
          setPlayerStats(prev => ({
            ...prev,
            ryo: prev.ryo + 300,
            scrolls: prev.scrolls + scrollsCollected
          }));
        },
        onGameOver: () => {
          setShowGameOverModal(true);
        }
      },
      playerStats.activeBuff
    );

    engineRef.current = engine;
    engine.start();

    // Keyboard Listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', ' '].includes(e.key)) {
        e.preventDefault();
      }

      engine.keys[e.key] = true;
      engine.keys[e.code] = true;

      if (e.key === 'z' || e.key === 'Z') {
        engine.actionRasengan();
      } else if (e.key === 'x' || e.key === 'X') {
        engine.actionShunshin();
      } else if (e.key === 'c' || e.key === 'C') {
        engine.actionCloneBurst();
      } else if (e.key === 'r' || e.key === 'R') {
        handleRestart();
      } else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        handleTogglePause();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      engine.keys[e.key] = false;
      engine.keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      engine.stop();
      engineRef.current = null;
    };
  }, [currentLevelNum]);

  // Update active buffs in engine
  useEffect(() => {
    if (engineRef.current && playerStats.activeBuff) {
      engineRef.current.setBuff(playerStats.activeBuff);
    }
  }, [playerStats.activeBuff]);

  const handleRestart = () => {
    setShowClearModal(false);
    setShowGameOverModal(false);
    if (engineRef.current) {
      engineRef.current.initLevel(activeLevel);
      engineRef.current.start();
      setIsPaused(false);
    }
  };

  const handleTogglePause = () => {
    if (engineRef.current) {
      const paused = engineRef.current.togglePause();
      setIsPaused(paused);
    }
  };

  const handleSelectLevel = (levelNum: number) => {
    sound.click();
    setShowClearModal(false);
    setShowGameOverModal(false);
    setCurrentLevelNum(levelNum);
  };

  const handleNextLevel = () => {
    sound.click();
    setShowClearModal(false);
    if (currentLevelNum < 10) {
      setCurrentLevelNum(currentLevelNum + 1);
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto px-2 sm:px-4 py-3">
      {/* 1. TOP 10-BOSS LEVEL SELECT STRIP */}
      <div className="bg-[#0f172a]/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[11px] text-[#ff6a00] uppercase tracking-wider">
              10-Boss Epic Campaign
            </span>
            <span className="text-xs text-slate-400">
              Select any encounter to play:
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Boss #{activeLevel.boss.id}: <span className="text-[#38bdf8] font-bold">{activeLevel.boss.name}</span>
          </div>
        </div>

        {/* 10 Level Buttons */}
        <div className="flex items-center gap-2 min-w-[850px] pb-1">
          {LEVELS.map(lvl => {
            const isCurrent = lvl.levelNum === currentLevelNum;
            const isUnlocked = unlockedLevels.includes(lvl.levelNum) || lvl.levelNum <= 3; // First 3 free to test right away

            return (
              <button
                key={lvl.levelNum}
                onClick={() => handleSelectLevel(lvl.levelNum)}
                className={`flex-1 min-w-[80px] p-2 rounded-xl flex flex-col items-center gap-1.5 transition-all relative border ${
                  isCurrent
                    ? 'bg-[#1e293b] border-[#ff6a00] shadow-[0_0_12px_rgba(255,106,0,0.5)] scale-[1.03]'
                    : isUnlocked
                    ? 'bg-[#0b1329] border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'
                    : 'bg-[#080d1a] border-slate-900 opacity-60 hover:opacity-80'
                }`}
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-black">
                  <img
                    src={lvl.boss.avatar}
                    alt={lvl.boss.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {isCurrent && (
                    <div className="absolute inset-0 bg-[#ff6a00]/30 animate-pulse" />
                  )}
                </div>
                <div className="text-center w-full">
                  <div className="text-[10px] font-pixel text-slate-300 truncate">
                    L{lvl.levelNum}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate max-w-[80px]">
                    {lvl.boss.name.split(' ')[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN GAME CANVAS & SCREEN */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-2xl flex flex-col items-center justify-center aspect-[16/10] max-h-[640px]"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block pixel-crisp object-contain cursor-crosshair"
        />

        {/* Scanlines Overlay */}
        {scanlinesActive && (
          <div className="absolute inset-0 pointer-events-none scanlines opacity-50" />
        )}

        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-30">
            <h2 className="font-pixel text-2xl text-[#00f0ff] cyber-glow">
              GAME PAUSED
            </h2>
            <p className="text-slate-300 text-sm">Press P or Resume to continue your shinobi path</p>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={handleTogglePause}
                className="px-5 py-2 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-pixel text-xs flex items-center gap-2 shadow-lg"
              >
                <Play className="w-4 h-4" /> Resume
              </button>
              <button
                onClick={handleRestart}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel text-xs flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Restart
              </button>
            </div>
          </div>
        )}

        {/* Level Clear Modal */}
        {showClearModal && lastClearedLevel && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-40 p-6 animate-in fade-in zoom-in duration-300">
            <div className="w-14 h-14 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center text-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              <Trophy className="w-7 h-7" />
            </div>
            <h2 className="font-cinzel text-3xl font-black text-white tracking-wider text-center">
              STAGE CLEARED!
            </h2>
            <p className="font-pixel text-xs text-[#00f0ff] text-center">
              {lastClearedLevel.boss.name} DEFEATED
            </p>
            <blockquote className="italic text-xs text-slate-300 text-center max-w-md bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              "{lastClearedLevel.boss.quote}"
            </blockquote>
            <div className="flex items-center gap-4 text-xs font-pixel text-amber-400 bg-amber-950/40 px-4 py-2 rounded-lg border border-amber-800/50">
              <span>+300 RYO REWARD</span>
              <span>•</span>
              <span>SCROLLS LOGGED</span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              {currentLevelNum < 10 ? (
                <button
                  onClick={handleNextLevel}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6a00] to-[#ea580c] hover:opacity-95 text-white font-pixel text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(255,106,0,0.5)]"
                >
                  Next Boss Battle <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleRestart}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:opacity-95 text-white font-pixel text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                >
                  <Trophy className="w-4 h-4" /> Shinobi Champion! Replay
                </button>
              )}
              <button
                onClick={handleRestart}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-pixel text-xs flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Replay Stage
              </button>
            </div>
          </div>
        )}

        {/* Game Over Modal */}
        {showGameOverModal && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-40 p-6 animate-in fade-in zoom-in duration-300">
            <div className="w-14 h-14 rounded-full bg-red-950/60 border-2 border-red-600 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
              <Skull className="w-7 h-7" />
            </div>
            <h2 className="font-pixel text-2xl text-red-500 tracking-wider text-center fire-glow">
              MISSION FAILED
            </h2>
            <p className="text-xs text-slate-300 max-w-sm text-center">
              "A shinobi never gives up! That's my nindo, my ninja way!"
            </p>
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={handleRestart}
                className="px-6 py-2.5 rounded-xl bg-[#ff6a00] hover:bg-[#ea580c] text-white font-pixel text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(255,106,0,0.5)]"
              >
                <RotateCcw className="w-4 h-4" /> Retry (Press R)
              </button>
            </div>
          </div>
        )}

        {/* Bottom Quick Controls Bar on Canvas */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-20 bg-slate-900/80 backdrop-blur-sm p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setScanlinesActive(!scanlinesActive)}
            title="Toggle Scanlines (CRT effect)"
            className={`p-1.5 rounded text-xs transition-all ${
              scanlinesActive ? 'text-[#00f0ff] bg-cyan-950/50' : 'text-slate-400'
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>
          <button
            onClick={handleTogglePause}
            title="Pause / Resume"
            className="p-1.5 rounded text-slate-300 hover:text-white"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={handleRestart}
            title="Quick Restart (R)"
            className="p-1.5 rounded text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleFullscreen}
            title="Fullscreen"
            className="p-1.5 rounded text-slate-300 hover:text-white"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. VIRTUAL CONTROLS & KEYBOARD GUIDE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Keyboard Instructions Card */}
        <div className="bg-[#0f172a]/90 p-4 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-pixel text-[#ff6a00] uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Shinobi Controls & Jutsu
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800">
              <span className="font-mono font-bold text-[#00f0ff] block">A / D or ◄ ►</span>
              <span className="text-slate-400 text-[11px]">Sprint Left / Right</span>
            </div>
            <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800">
              <span className="font-mono font-bold text-[#00f0ff] block">W / ▲ / Space</span>
              <span className="text-slate-400 text-[11px]">Jump & Stomp Foes</span>
            </div>
            <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800">
              <span className="font-mono font-bold text-[#00f0ff] block">S / ▼</span>
              <span className="text-slate-400 text-[11px]">Drop Thru Platform</span>
            </div>
            <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800">
              <span className="font-mono font-bold text-amber-400 block">Z Key</span>
              <span className="text-slate-400 text-[11px]">Rasengan (25 Chakra)</span>
            </div>
            <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800">
              <span className="font-mono font-bold text-emerald-400 block">X Key</span>
              <span className="text-slate-400 text-[11px]">Shunshin Dash (15 CP)</span>
            </div>
            <div className="bg-slate-900/70 p-2 rounded-xl border border-slate-800">
              <span className="font-mono font-bold text-purple-400 block">C Key</span>
              <span className="text-slate-400 text-[11px]">Clone Burst (30 CP)</span>
            </div>
          </div>
        </div>

        {/* On-Screen Touch / Mouse Gamepad */}
        <div className="bg-[#0f172a]/90 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-2">
          {/* Virtual D-pad */}
          <div className="flex flex-col items-center gap-1">
            <button
              onMouseDown={() => {
                if (engineRef.current) engineRef.current.actionJump();
              }}
              className="w-11 h-10 rounded-xl bg-slate-800 active:bg-[#ff6a00] text-white flex items-center justify-center shadow font-bold text-xs"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              <button
                onMouseDown={() => {
                  if (engineRef.current) engineRef.current.keys['ArrowLeft'] = true;
                }}
                onMouseUp={() => {
                  if (engineRef.current) engineRef.current.keys['ArrowLeft'] = false;
                }}
                onMouseLeave={() => {
                  if (engineRef.current) engineRef.current.keys['ArrowLeft'] = false;
                }}
                className="w-11 h-10 rounded-xl bg-slate-800 active:bg-[#ff6a00] text-white flex items-center justify-center shadow font-bold text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onMouseDown={() => {
                  if (engineRef.current) engineRef.current.keys['ArrowDown'] = true;
                }}
                onMouseUp={() => {
                  if (engineRef.current) engineRef.current.keys['ArrowDown'] = false;
                }}
                onMouseLeave={() => {
                  if (engineRef.current) engineRef.current.keys['ArrowDown'] = false;
                }}
                className="w-11 h-10 rounded-xl bg-slate-800 active:bg-[#ff6a00] text-white flex items-center justify-center shadow font-bold text-xs"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onMouseDown={() => {
                  if (engineRef.current) engineRef.current.keys['ArrowRight'] = true;
                }}
                onMouseUp={() => {
                  if (engineRef.current) engineRef.current.keys['ArrowRight'] = false;
                }}
                onMouseLeave={() => {
                  if (engineRef.current) engineRef.current.keys['ArrowRight'] = false;
                }}
                className="w-11 h-10 rounded-xl bg-slate-800 active:bg-[#ff6a00] text-white flex items-center justify-center shadow font-bold text-xs"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Virtual Action Buttons (Z, X, C, Jump) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (engineRef.current) engineRef.current.actionRasengan();
              }}
              className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white shadow-lg active:scale-95 border border-[#38bdf8]/40"
            >
              <Zap className="w-4 h-4" />
              <span className="text-[10px] font-pixel mt-0.5">Z</span>
            </button>

            <button
              onClick={() => {
                if (engineRef.current) engineRef.current.actionShunshin();
              }}
              className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#047857] text-white shadow-lg active:scale-95 border border-[#34d399]/40"
            >
              <Flame className="w-4 h-4" />
              <span className="text-[10px] font-pixel mt-0.5">X</span>
            </button>

            <button
              onClick={() => {
                if (engineRef.current) engineRef.current.actionCloneBurst();
              }}
              className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] text-white shadow-lg active:scale-95 border border-[#c084fc]/40"
            >
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-pixel mt-0.5">C</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
