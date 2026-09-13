import React, { useState } from 'react';
import { PlayerStats, SkillUpgrade } from '../types';
import { sound } from '../game/sound';
import {
  Sparkles,
  Coins,
  Scroll,
  Heart,
  Zap,
  CheckCircle2,
  Lock,
  Utensils,
  Award,
  ChevronRight
} from 'lucide-react';

interface ShinobiStatsProps {
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
  onGoToGame: () => void;
}

interface RamenDish {
  id: string;
  name: string;
  priceRyo: number;
  description: string;
  buff: {
    name: string;
    description: string;
    duration: number;
    atkMultiplier: number;
    speedBoost: number;
    chakraRegen: number;
  };
}

const RAMEN_MENU: RamenDish[] = [
  {
    id: 'miso_pork',
    name: 'Miso Chashu Special',
    priceRyo: 200,
    description: 'Slow-simmered rich red miso broth with tender braised pork belly slices.',
    buff: {
      name: 'Miso Power (+35% ATK)',
      description: 'Increases Rasengan and Stomp damage by 35%',
      duration: 300,
      atkMultiplier: 1.35,
      speedBoost: 1.0,
      chakraRegen: 1.2
    }
  },
  {
    id: 'tonkotsu_swift',
    name: 'Tonkotsu Swift Broth',
    priceRyo: 250,
    description: 'Creamy pork bone collagen elixir infused with roasted black garlic oil.',
    buff: {
      name: 'Swift Shinobi (+30% SPD)',
      description: 'Increases sprint velocity and reduces dash cooldown',
      duration: 300,
      atkMultiplier: 1.1,
      speedBoost: 1.3,
      chakraRegen: 1.2
    }
  },
  {
    id: 'demon_spicy',
    name: 'Spicy Dragon Broth',
    priceRyo: 300,
    description: 'Scorching chili oil and fiery red peppers awakening your chakra pathways.',
    buff: {
      name: 'Chakra Surge (+100% Regen)',
      description: 'Doubles passive chakra regeneration rate in combat',
      duration: 300,
      atkMultiplier: 1.15,
      speedBoost: 1.1,
      chakraRegen: 2.0
    }
  },
  {
    id: 'hokage_feast',
    name: 'Grand Hokage Feast',
    priceRyo: 600,
    description: 'Extra double noodles, 4 seasoned soft-boiled eggs, nori sheets, and gold-flaked bamboo shoots.',
    buff: {
      name: 'Hokage Might (Omni Boost)',
      description: '+50% ATK, +30% Speed, and +150% Chakra flow',
      duration: 400,
      atkMultiplier: 1.5,
      speedBoost: 1.3,
      chakraRegen: 2.5
    }
  }
];

const INITIAL_SKILLS: SkillUpgrade[] = [
  {
    id: 's1',
    name: 'Odama Rasengan Focus',
    description: 'Compresses chakra vortex for 30% wider hit radius and damage.',
    cost: 3,
    unlocked: true,
    tier: 1,
    statBonus: '+30% Rasengan Power'
  },
  {
    id: 's2',
    name: 'Swift Body Flicker (Shunshin)',
    description: 'Minimizes chakra loss and extends invulnerability frames during dash.',
    cost: 4,
    unlocked: false,
    tier: 2,
    statBonus: '+8 i-Frames on Dash'
  },
  {
    id: 's3',
    name: 'Multi-Shadow Clone Resilience',
    description: 'Shadow clones pop with explosive shockwaves knocking foes back.',
    cost: 6,
    unlocked: false,
    tier: 3,
    statBonus: '+50% Clone Burst Knockback'
  },
  {
    id: 's4',
    name: 'Nine-Tails Vermilion Vitality',
    description: 'Awakens Kurama’s lingering life-force granting a 4th permanent Heart.',
    cost: 8,
    unlocked: false,
    tier: 4,
    statBonus: '+1 Max Heart'
  }
];

export const ShinobiStats: React.FC<ShinobiStatsProps> = ({
  playerStats,
  setPlayerStats,
  onGoToGame
}) => {
  const [skills, setSkills] = useState<SkillUpgrade[]>(INITIAL_SKILLS);
  const [activeTab, setActiveTab] = useState<'ramen' | 'stats' | 'skills'>('ramen');
  const [teuchiMessage, setTeuchiMessage] = useState<string>(
    'Welcome to Ichiraku, Naruto! Nothing fuels a future Hokage like a fresh hot bowl of noodles!'
  );

  const handleEatRamen = (dish: RamenDish) => {
    if (playerStats.ryo < dish.priceRyo) {
      sound.hit();
      setTeuchiMessage("You're short on Ryo, kiddo! Complete some village missions first!");
      return;
    }

    sound.ramen();
    setPlayerStats(prev => ({
      ...prev,
      ryo: prev.ryo - dish.priceRyo,
      activeBuff: dish.buff
    }));

    setTeuchiMessage(`Enjoy the ${dish.name}! That’ll keep your chakra overflowing out on the battlefield!`);
  };

  const handleUnlockSkill = (skill: SkillUpgrade) => {
    if (playerStats.scrolls < skill.cost) {
      sound.hit();
      return;
    }

    sound.scroll();
    setPlayerStats(prev => ({
      ...prev,
      scrolls: prev.scrolls - skill.cost,
      maxHp: skill.id === 's4' ? prev.maxHp + 1 : prev.maxHp,
      hp: skill.id === 's4' ? prev.hp + 1 : prev.hp
    }));

    setSkills(prev =>
      prev.map(s => (s.id === skill.id ? { ...s, unlocked: true } : s))
    );
  };

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto px-2 sm:px-4 py-3">
      {/* Header */}
      <div className="bg-[#0f172a]/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-xs text-[#f59e0b] uppercase tracking-wider">
              Teuchi’s Ichiraku & Shinobi Growth
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-700/50 text-amber-400 text-[10px] font-bold">
              WARM HEARTH
            </span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
            Shinobi Stats & Ichiraku Ramen
          </h2>
        </div>

        {/* Section Navigation */}
        <div className="flex items-center gap-1.5 bg-[#080d1a] p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => {
              sound.click();
              setActiveTab('ramen');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ramen'
                ? 'bg-[#f59e0b] text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🍜</span>
            <span>Ichiraku Stall</span>
          </button>
          <button
            onClick={() => {
              sound.click();
              setActiveTab('stats');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'stats'
                ? 'bg-[#00f0ff] text-black shadow-[0_0_10px_rgba(0,240,255,0.5)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>📊</span>
            <span>Ninja Profile</span>
          </button>
          <button
            onClick={() => {
              sound.click();
              setActiveTab('skills');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'bg-[#8b5cf6] text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>📜</span>
            <span>Jutsu Skill Tree</span>
          </button>
        </div>
      </div>

      {/* 1. ICHIRAKU RAMEN SHOP VIEW */}
      {activeTab === 'ramen' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Shopkeeper Teuchi Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-xl aspect-[4/3] lg:aspect-auto flex flex-col justify-end p-5">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBItOcsg87V9WpoMEcpI9TBMUm523MakWtFgSKVCG27__33BzTzaapnszLhFME-tABIwEMoT__cxdASs35097wr410cPTvAENChTuJLjrAx03CfF8auhHCGWPoSA2M66DB-3J1NHbfHMvuvw4rrWX0YK8WU0cylgpLjlc-7cTWt5GhT7V879WHYc4GIlw174Zv_YwZqT7oXAjAGnIdMm7GENqbmey3BvkFzXDsTjqiQDJgy30teTM8"
              alt="Ichiraku Ramen Stall"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-slate-900">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9sAXDeBOkwKUkM6jtVectmx_sbBcDB2nFLAQ7T26p7irvp2s2zs_veiRlfbtUl8ekMcCY8oXF6kKNvoNp0IouMDIH9HPeRafCqfAL9Qrvzncne1qNPJEWWCTwPC1O0U0VbyIyksTn7mkbyO2s_r7mDlNZKvUZOJwpP8PvFRuLeDioZWzDRpaqJ9mLqLIirHTnzuUv9thlyWJCHpb5hu-SRPqwXmkBpEHX3Jw6PyjtHjzMM44ktZQ"
                    alt="Teuchi"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-cinzel text-base font-bold text-white">Master Teuchi</h3>
                  <span className="text-[10px] text-amber-400 font-pixel">Chef of the Leaf</span>
                </div>
              </div>

              <p className="text-xs text-amber-200/90 italic bg-black/70 backdrop-blur-sm p-3 rounded-xl border border-amber-950/60 leading-relaxed">
                "{teuchiMessage}"
              </p>

              {/* Current Active Buff status */}
              {playerStats.activeBuff ? (
                <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold block text-emerald-200">Active: {playerStats.activeBuff.name}</span>
                    <span className="text-[10px] text-emerald-400">{playerStats.activeBuff.description}</span>
                  </div>
                  <button
                    onClick={onGoToGame}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-pixel text-[10px]"
                  >
                    Fight!
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs">
                  No active ramen buff. Order a bowl to boost your battle stats!
                </div>
              )}
            </div>
          </div>

          {/* Menu Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RAMEN_MENU.map(dish => {
              const canAfford = playerStats.ryo >= dish.priceRyo;
              const isCurrentBuff = playerStats.activeBuff?.name === dish.buff.name;

              return (
                <div
                  key={dish.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    isCurrentBuff
                      ? 'bg-amber-950/30 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'bg-[#0f172a]/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-white">{dish.name}</span>
                      <span className="font-pixel text-xs text-[#fbbf24] flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" /> {dish.priceRyo} Ryo
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                      {dish.description}
                    </p>

                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-amber-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{dish.buff.description}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEatRamen(dish)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 rounded-xl font-pixel text-xs flex items-center justify-center gap-2 transition-all ${
                      isCurrentBuff
                        ? 'bg-emerald-600 text-white cursor-default'
                        : canAfford
                        ? 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:opacity-95 text-black font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    {isCurrentBuff ? 'Dish Active in Battle!' : canAfford ? 'Order & Consume' : 'Need More Ryo'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. SHINOBI RADAR PROFILE VIEW */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Portrait & Title */}
          <div className="bg-[#0f172a]/90 p-5 rounded-2xl border border-slate-800 flex flex-col items-center text-center gap-3">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#ff6a00] shadow-[0_0_20px_rgba(255,106,0,0.5)] bg-black">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJeS-U6p3_lMSUv2FO6Cmn575pc_GkUTXpUKIbC2pdtTGoSK-Y_pQHjgUNKDDeA0D_oeusjO9MpMVIHVhnUCI7R1Yw7EqOnQjAJypUVTOUzQelY6ndBIOjjy_th6NCAb5rXkgb6zKU0Bb9WmmwsDn5YFuhqS91A_kIes144x7Gb7RNg-2XS8jD6PiaejzNzK3bseo3mLmyE4isJlqZlSh_4HxrdDrF0HZO5_wzatiJRTCRHg__Keo"
                alt="Naruto Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-cinzel text-xl font-bold text-white">Naruto Uzumaki</h3>
              <p className="text-xs text-[#ff6a00] font-pixel">Team 7 • Nine-Tails Host</p>
              <p className="text-xs text-slate-400 mt-1">Ninja Registration #012607</p>
            </div>
            <div className="w-full pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Shinobi Rank:</span>
                <span className="text-white font-bold">Genin (Hero of Leaf)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Chakra Nature:</span>
                <span className="text-[#00f0ff] font-bold">Wind (Futon)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Nindo / Motto:</span>
                <span className="text-amber-300 italic">"Never give up!"</span>
              </div>
            </div>
          </div>

          {/* Canonical Shinobi Data Meters */}
          <div className="md:col-span-2 bg-[#0f172a]/90 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="font-pixel text-xs text-[#00f0ff] uppercase tracking-wider">
              Canonical Shinobi Attributes
            </h4>

            <div className="space-y-3">
              {[
                { name: 'Taijutsu (Hand-to-hand)', val: 85, color: '#f97316' },
                { name: 'Ninjutsu (Jutsu Mastery)', val: 92, color: '#00f0ff' },
                { name: 'Genjutsu (Illusion Resistance)', val: 40, color: '#a855f7' },
                { name: 'Chakra Reserves (Nine-Tails)', val: 100, color: '#ef4444' },
                { name: 'Stamina & Durability', val: 95, color: '#10b981' },
                { name: 'Willpower & Gut (Nindo)', val: 100, color: '#fbbf24' }
              ].map(stat => (
                <div key={stat.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{stat.name}</span>
                    <span className="font-mono font-bold" style={{ color: stat.color }}>
                      {stat.val}/100
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${stat.val}%`, backgroundColor: stat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. JUTSU SKILL TREE VIEW */}
      {activeTab === 'skills' && (
        <div className="bg-[#0f172a]/90 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-cinzel text-xl font-bold text-white">Jutsu Mastery Tree</h3>
              <p className="text-xs text-slate-400">
                Unlock permanent combat upgrades using Secret Ninja Scrolls found across levels.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-pixel text-[#38bdf8]">
              <Scroll className="w-4 h-4" />
              <span>Available Scrolls: {playerStats.scrolls}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {skills.map(skill => {
              const canUnlock = playerStats.scrolls >= skill.cost && !skill.unlocked;

              return (
                <div
                  key={skill.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    skill.unlocked
                      ? 'bg-purple-950/30 border-purple-600/70 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-pixel text-purple-400 uppercase">
                        Tier {skill.tier} Perk
                      </span>
                      {skill.unlocked ? (
                        <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                        </span>
                      ) : (
                        <span className="font-pixel text-xs text-[#38bdf8] flex items-center gap-1">
                          <Scroll className="w-3.5 h-3.5" /> {skill.cost} Scrolls
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-white mb-1">{skill.name}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2">
                      {skill.description}
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 text-[10px] font-mono border border-purple-700/40">
                      {skill.statBonus}
                    </span>
                  </div>

                  {!skill.unlocked && (
                    <button
                      onClick={() => handleUnlockSkill(skill)}
                      disabled={!canUnlock}
                      className={`w-full py-2 rounded-xl font-pixel text-xs flex items-center justify-center gap-2 transition-all ${
                        canUnlock
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {canUnlock ? 'Unlock Skill' : 'Need More Scrolls'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
