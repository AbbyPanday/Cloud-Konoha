import React, { useState } from 'react';
import { sound } from '../game/sound';
import {
  Flame,
  Zap,
  Users,
  Shield,
  Swords,
  Sparkles,
  Trophy,
  RotateCcw
} from 'lucide-react';

interface JutsuMove {
  id: string;
  name: string;
  element: 'Wind' | 'Fire' | 'Lightning' | 'Chakra' | 'Senjutsu';
  chakraCost: number;
  basePower: number;
  description: string;
  icon: string;
}

const JUTSUS: JutsuMove[] = [
  {
    id: 'rasengan',
    name: 'Spiralling Sphere: Rasengan',
    element: 'Wind',
    chakraCost: 30,
    basePower: 85,
    description: 'High-density spinning chakra sphere that grindingly decimates enemy defenses.',
    icon: '🌀'
  },
  {
    id: 'clones',
    name: 'Multi-Shadow Clone Barrage',
    element: 'Chakra',
    chakraCost: 25,
    basePower: 65,
    description: 'Summons a legion of physical clones delivering a synchronized aerial beating.',
    icon: '👥'
  },
  {
    id: 'kyuubi',
    name: 'One-Tail Cloak: Vermilion Roar',
    element: 'Fire',
    chakraCost: 50,
    basePower: 120,
    description: 'Unleashes bubbling red Nine-Tails chakra with ferocious shockwaves.',
    icon: '🦊'
  },
  {
    id: 'sage',
    name: 'Sage Art: Giant Rasengan',
    element: 'Senjutsu',
    chakraCost: 40,
    basePower: 105,
    description: 'Natural energy channeled from Mount Myoboku in devastating frog kata.',
    icon: '🐸'
  }
];

export const ChakraArena: React.FC = () => {
  const [narutoHp, setNarutoHp] = useState(100);
  const [narutoChakra, setNarutoChakra] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [enemyChakra, setEnemyChakra] = useState(100);
  const [clashing, setClashing] = useState(false);
  const [battleLogs, setBattleLogs] = useState<string[]>([
    '⚔️ Arena standby: Naruto stands before Curse Mark Sasuke at the Valley of the End!'
  ]);
  const [clashResult, setClashResult] = useState<string | null>(null);

  const handleCastJutsu = (jutsu: JutsuMove) => {
    if (clashing || narutoHp <= 0 || enemyHp <= 0) return;
    if (narutoChakra < jutsu.chakraCost) {
      sound.hit();
      return;
    }

    setClashing(true);
    setNarutoChakra(prev => Math.max(0, prev - jutsu.chakraCost));

    if (jutsu.id === 'rasengan') sound.rasengan();
    else if (jutsu.id === 'kyuubi') sound.kyuubiRoar();
    else if (jutsu.id === 'clones') sound.clone();
    else sound.shunshin();

    // Enemy responds with Chidori or Fireball
    const enemyMoves = ['Chidori: One Thousand Birds', 'Fire Style: Dragon Fire Jutsu', 'Curse Mark Spear'];
    const enemyMove = enemyMoves[Math.floor(Math.random() * enemyMoves.length)];

    setTimeout(() => {
      sound.bossHit();
      const damageToEnemy = Math.floor(jutsu.basePower * (0.8 + Math.random() * 0.4));
      const damageToNaruto = Math.floor(25 + Math.random() * 20);

      setEnemyHp(prev => Math.max(0, prev - damageToEnemy));
      setNarutoHp(prev => Math.max(0, prev - damageToNaruto));
      setEnemyChakra(prev => Math.max(0, prev - 25));

      setBattleLogs(prev => [
        `💥 Naruto unleashes ${jutsu.name} for ${damageToEnemy} DMG!`,
        `⚡ Sasuke counters with ${enemyMove} dealing ${damageToNaruto} DMG!`,
        ...prev.slice(0, 8)
      ]);

      setClashing(false);

      if (enemyHp - damageToEnemy <= 0) {
        sound.levelClear();
        setClashResult('VICTORY! Naruto’s nindo prevails over the curse mark!');
      } else if (narutoHp - damageToNaruto <= 0) {
        sound.gameOver();
        setClashResult('DEFEAT! Sasuke severed the bond...');
      }
    }, 1200);
  };

  const handleResetArena = () => {
    sound.click();
    setNarutoHp(100);
    setNarutoChakra(100);
    setEnemyHp(100);
    setEnemyChakra(100);
    setClashing(false);
    setClashResult(null);
    setBattleLogs(['⚔️ Arena reset: Destined rivals lock eyes once again.']);
  };

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto px-2 sm:px-4 py-3">
      {/* Header */}
      <div className="bg-[#0f172a]/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-xs text-[#ef4444] uppercase tracking-wider">
              Valley of the End Duel Arena
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-950/60 border border-red-700/50 text-red-400 text-[10px] font-bold">
              DESTINED CLASH
            </span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
            Chakra Tactical Arena
          </h2>
        </div>

        <button
          onClick={handleResetArena}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel text-xs flex items-center gap-2 border border-slate-700 transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Reset Duel
        </button>
      </div>

      {/* Main Clash Arena Backdrop */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-2xl aspect-[16/9] max-h-[480px]">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDopLKN_0uk0eWmAENAmfznogJE6YLbeA0ck2ViMo4X3v8d0Z2iBiAyHlyGi8qYX_kZNEkLhWRRpyAtwd0O_tegTvZISeEVYT3gHWbZL09B0f96nzrj5s3I9mQWzBVJCiyfyZ8dPme_skFq8aMJMjGGvVc8NcnLihFeI-hXLWWk5mrheCTqJTIN_QXjw4PWMXA7orh8tB-zIhDrZoqG3zAO-xBYmtzfYnJD8I7Xbn8b3UKDSn_HRMc"
          alt="Valley of the End Arena"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />

        {/* Combatant Portals */}
        <div className="absolute inset-0 p-6 flex items-center justify-between pointer-events-none">
          {/* Naruto Side */}
          <div className="flex flex-col items-center gap-2 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-[#ff6a00]/50 pointer-events-auto">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#ff6a00] shadow-[0_0_20px_rgba(255,106,0,0.6)]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBktYp-MB6QN3EjgxqAHEFnVYmtuZNkwSt2bSBuA9JMBU6JmKsSM-fXxdQXV8FQ3NyA8p-Okz4iAClhj1grmHzC_5G2QKihKq0s-XDJkGCVqz8vOXkNtlkJ-1h94EsEjCCoZmVZSBUe4zNwjPbN1oEdQk-guiLXGAnYdTssY4SjJSAzWrhLGjIeLlTXK0DRpzGN-3QdaCMogMdvyG4ekSuHGLqGzyqCXnUv5OztXP8VtA2BLq8dk5Q"
                alt="Naruto"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-pixel text-xs text-white">NARUTO</span>
            <div className="w-28 space-y-1">
              {/* HP */}
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 transition-all" style={{ width: `${narutoHp}%` }} />
              </div>
              {/* Chakra */}
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#00f0ff] transition-all" style={{ width: `${narutoChakra}%` }} />
              </div>
            </div>
          </div>

          {/* Central Clash Vortex */}
          {clashing && (
            <div className="flex flex-col items-center animate-spin">
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.9)] flex items-center justify-center">
                <Zap className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>
          )}

          {/* Sasuke Side */}
          <div className="flex flex-col items-center gap-2 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-purple-500/50 pointer-events-auto">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA0qaxPIh-bcAd6zCd1DMHaEQ080U3udGKoSy7pQEaZE2ScDi3hHlPrU-YDRr36aB_6TltbiW_BBs5SgacNPMXdyZ21CJgNANodX2fnNmAwixGbAP-280CfHWl2hXmeN4dtVZpcooS4fN9pAcqGKXiSDN90hNHVBl9UBoL1B6OXQoQ1WAt9X6Oo_jveMpKsna3v9JSgHrYHbS38KqyUsMt_WfXNtgWAfXwI1IPSs8ZPyUVb3yi8zk"
                alt="Sasuke"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-pixel text-xs text-white">SASUKE</span>
            <div className="w-28 space-y-1">
              {/* HP */}
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 transition-all" style={{ width: `${enemyHp}%` }} />
              </div>
              {/* Chakra */}
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 transition-all" style={{ width: `${enemyChakra}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Victory / Defeat Banner */}
        {clashResult && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-20">
            <h3 className="font-cinzel text-2xl font-bold text-amber-400 text-center mb-2">
              {clashResult}
            </h3>
            <button
              onClick={handleResetArena}
              className="px-6 py-2.5 rounded-xl bg-[#ff6a00] text-white font-pixel text-xs mt-3 shadow-lg"
            >
              Rematch (Reset)
            </button>
          </div>
        )}
      </div>

      {/* Jutsu Wheel & Battle Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Jutsu Selection Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {JUTSUS.map(j => {
            const hasChakra = narutoChakra >= j.chakraCost;
            return (
              <button
                key={j.id}
                onClick={() => handleCastJutsu(j)}
                disabled={!hasChakra || clashing}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  hasChakra
                    ? 'bg-[#0f172a]/90 border-slate-800 hover:border-[#ff6a00] hover:scale-[1.02] shadow-md'
                    : 'bg-slate-900/40 border-slate-900 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="text-2xl p-2 rounded-xl bg-slate-800 shrink-0">
                  {j.icon}
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-white">{j.name}</span>
                    <span className="text-[10px] font-pixel text-[#00f0ff]">
                      {j.chakraCost} CP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                    {j.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">
                      PWR: {j.basePower}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 font-mono">
                      {j.element} Style
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Combat Chronicle Log */}
        <div className="bg-[#0f172a]/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="font-pixel text-xs text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Swords className="w-3.5 h-3.5 text-[#ff6a00]" /> Combat Chronicle
            </h4>
            <div className="space-y-2 text-xs font-mono text-slate-300 max-h-[220px] overflow-y-auto pr-1">
              {battleLogs.map((log, idx) => (
                <div key={idx} className="p-1.5 rounded bg-slate-900/70 border border-slate-800/80">
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Hint: High chakra jutsus deal devastating damage. Manage your stamina wisely!
          </div>
        </div>
      </div>
    </div>
  );
};
