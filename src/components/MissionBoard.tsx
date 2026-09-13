import React, { useState, useEffect } from 'react';
import { Mission, PlayerStats } from '../types';
import { sound } from '../game/sound';
import {
  Scroll,
  Coins,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Send,
  UserCheck,
  Award
} from 'lucide-react';

interface MissionBoardProps {
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
}

const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm1',
    rank: 'D',
    title: 'Retrieve Madame Shijimi’s Pet Cat Tora',
    location: 'Hidden Leaf Eastern Commons',
    client: 'Fire Daimyo’s Wife',
    rewardRyo: 150,
    rewardScrolls: 1,
    description: 'Track the swift ninja feline Tora through the alleyways and bring him back uninjured.',
    status: 'available',
    assignedShinobi: ['Naruto'],
    durationSeconds: 15,
    progressSeconds: 0
  },
  {
    id: 'm2',
    rank: 'C',
    title: 'Escort Master Tazuna to Land of Waves',
    location: 'Great Naruto Bridge Route',
    client: 'Tazuna the Master Carpenter',
    rewardRyo: 400,
    rewardScrolls: 2,
    description: 'Safeguard the chief bridge builder from rogue mercenary ambushes along the coastal perimeter.',
    status: 'available',
    assignedShinobi: ['Naruto', 'Sasuke'],
    durationSeconds: 30,
    progressSeconds: 0
  },
  {
    id: 'm3',
    rank: 'B',
    title: 'Infiltrate Sound Village Outpost',
    location: 'Northern Rice Patty Ruins',
    client: 'Leaf Intelligence Division',
    rewardRyo: 750,
    rewardScrolls: 3,
    description: 'Scout Orochimaru’s hidden laboratory and secure experimental cursed mark scrolls.',
    status: 'available',
    assignedShinobi: ['Naruto', 'Sakura'],
    durationSeconds: 45,
    progressSeconds: 0
  },
  {
    id: 'm4',
    rank: 'A',
    title: 'Repel Sunagakure Shukaku Breach',
    location: 'Chunin Exam Forest Perimeter',
    client: 'Lord Third Hokage',
    rewardRyo: 1200,
    rewardScrolls: 4,
    description: 'Intercept the transforming Sand Jinchuriki before the colossal sand tsunami breaches the inner walls.',
    status: 'available',
    assignedShinobi: ['Naruto', 'Sasuke', 'Sakura'],
    durationSeconds: 60,
    progressSeconds: 0
  },
  {
    id: 'm5',
    rank: 'S',
    title: 'Classified: Subdue Akatsuki Vanguard',
    location: 'Scorched Leaf Village Core',
    client: 'Lady Tsunade, Fifth Hokage',
    rewardRyo: 2500,
    rewardScrolls: 6,
    description: 'Supreme emergency! Counter the God of Six Paths Pain and protect the Nine-Tails from capture.',
    status: 'available',
    assignedShinobi: ['Naruto', 'Sasuke'],
    durationSeconds: 90,
    progressSeconds: 0
  }
];

export const MissionBoard: React.FC<MissionBoardProps> = ({
  playerStats,
  setPlayerStats
}) => {
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [selectedRank, setSelectedRank] = useState<string>('ALL');

  // Mission timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setMissions(prevMissions =>
        prevMissions.map(m => {
          if (m.status === 'in_progress') {
            const nextProgress = m.progressSeconds + 1;
            if (nextProgress >= m.durationSeconds) {
              sound.levelClear();
              // Award rewards
              setPlayerStats(p => ({
                ...p,
                ryo: p.ryo + m.rewardRyo,
                scrolls: p.scrolls + m.rewardScrolls
              }));
              return { ...m, progressSeconds: m.durationSeconds, status: 'completed' };
            }
            return { ...m, progressSeconds: nextProgress };
          }
          return m;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [setPlayerStats]);

  const handleStartMission = (missionId: string) => {
    sound.scroll();
    setMissions(prev =>
      prev.map(m => (m.id === missionId ? { ...m, status: 'in_progress', progressSeconds: 0 } : m))
    );
  };

  const handleClaimMission = (missionId: string) => {
    sound.ramen();
    setMissions(prev =>
      prev.map(m => (m.id === missionId ? { ...m, status: 'available', progressSeconds: 0 } : m))
    );
  };

  const filteredMissions =
    selectedRank === 'ALL'
      ? missions
      : missions.filter(m => m.rank === selectedRank);

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto px-2 sm:px-4 py-3">
      {/* Header */}
      <div className="bg-[#0f172a]/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-xs text-[#8b5cf6] uppercase tracking-wider">
              Hokage Mission Assignment Bureau
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-700/50 text-purple-400 text-[10px] font-bold">
              TEAM 7 DISPATCH
            </span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
            Shinobi Mission Board
          </h2>
        </div>

        {/* Rank Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#080d1a] p-1 rounded-xl border border-slate-800 text-xs">
          {['ALL', 'D', 'C', 'B', 'A', 'S'].map(rank => (
            <button
              key={rank}
              onClick={() => {
                sound.click();
                setSelectedRank(rank);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedRank === rank
                  ? 'bg-[#8b5cf6] text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {rank === 'ALL' ? 'All Ranks' : `${rank}-Rank`}
            </button>
          ))}
        </div>
      </div>

      {/* Squad 7 Shinobi Active Roster Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Naruto */}
        <div className="bg-[#0f172a]/80 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#ff6a00] bg-black shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBktYp-MB6QN3EjgxqAHEFnVYmtuZNkwSt2bSBuA9JMBU6JmKsSM-fXxdQXV8FQ3NyA8p-Okz4iAClhj1grmHzC_5G2QKihKq0s-XDJkGCVqz8vOXkNtlkJ-1h94EsEjCCoZmVZSBUe4zNwjPbN1oEdQk-guiLXGAnYdTssY4SjJSAzWrhLGjIeLlTXK0DRpzGN-3QdaCMogMdvyG4ekSuHGLqGzyqCXnUv5OztXP8VtA2BLq8dk5Q"
              alt="Naruto"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Naruto Uzumaki</div>
            <div className="text-[10px] text-[#ff6a00] font-pixel">Genin • Jinchuriki</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <UserCheck className="w-3 h-3" /> Ready for Action
            </div>
          </div>
        </div>

        {/* Sasuke */}
        <div className="bg-[#0f172a]/80 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#3b82f6] bg-black shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA0qaxPIh-bcAd6zCd1DMHaEQ080U3udGKoSy7pQEaZE2ScDi3hHlPrU-YDRr36aB_6TltbiW_BBs5SgacNPMXdyZ21CJgNANodX2fnNmAwixGbAP-280CfHWl2hXmeN4dtVZpcooS4fN9pAcqGKXiSDN90hNHVBl9UBoL1B6OXQoQ1WAt9X6Oo_jveMpKsna3v9JSgHrYHbS38KqyUsMt_WfXNtgWAfXwI1IPSs8ZPyUVb3yi8zk"
              alt="Sasuke"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Sasuke Uchiha</div>
            <div className="text-[10px] text-[#3b82f6] font-pixel">Genin • Sharingan</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <UserCheck className="w-3 h-3" /> Ready for Action
            </div>
          </div>
        </div>

        {/* Sakura */}
        <div className="bg-[#0f172a]/80 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#ec4899] bg-black shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvePE9_iW8snIDm4b9SI8Mx4Ucpc3vZeKGzU0fAlY7mItrm-Yg5KR-YUvW3dmfsw0_Ul4wepVK2voWdt98GJKH7uhG8fpscbw46TVMWT3MDX7Hy05T3cIKG9-WnJBqq-1KHZJNHbE6ZjQMkVJCoINvA2Qvdl-iIp5N-4-4a9nhBq7EwXg-BAY26_Gi93Q0aGOauNaSX-MARq3ZnjXkbic2u1_dE9Si2Sogc-8yZ2T48DkZet6XnOE"
              alt="Sakura"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Sakura Haruno</div>
            <div className="text-[10px] text-[#ec4899] font-pixel">Genin • Chakra Control</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <UserCheck className="w-3 h-3" /> Ready for Action
            </div>
          </div>
        </div>
      </div>

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMissions.map(m => {
          const isComplete = m.status === 'completed';
          const inProgress = m.status === 'in_progress';
          const progressPct = Math.min(100, Math.floor((m.progressSeconds / m.durationSeconds) * 100));

          return (
            <div
              key={m.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                isComplete
                  ? 'bg-emerald-950/20 border-emerald-800/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : inProgress
                  ? 'bg-purple-950/20 border-purple-800/60 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                  : 'bg-[#0f172a]/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-pixel font-bold ${
                      m.rank === 'S'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : m.rank === 'A'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : m.rank === 'B'
                        ? 'bg-purple-950 text-purple-400 border border-purple-800'
                        : m.rank === 'C'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    RANK {m.rank}
                  </span>

                  <div className="flex items-center gap-2 text-xs font-pixel">
                    <span className="text-[#fbbf24] flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" /> +{m.rewardRyo} Ryo
                    </span>
                    <span className="text-[#38bdf8] flex items-center gap-1">
                      <Scroll className="w-3.5 h-3.5" /> +{m.rewardScrolls}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{m.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {m.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 py-1.5 border-t border-slate-800/80">
                  <span>Client: <strong className="text-slate-200">{m.client}</strong></span>
                  <span>Zone: <strong className="text-slate-200">{m.location}</strong></span>
                </div>
              </div>

              {/* Progress & Actions */}
              <div>
                {inProgress && (
                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-[11px] font-mono text-purple-400">
                      <span>In Progress...</span>
                      <span>{m.progressSeconds}s / {m.durationSeconds}s</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                )}

                {isComplete ? (
                  <button
                    onClick={() => handleClaimMission(m.id)}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-pixel text-xs flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mission Accomplished! Claim Reward
                  </button>
                ) : inProgress ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-xl bg-purple-900/40 text-purple-300 font-pixel text-xs flex items-center justify-center gap-2 cursor-wait border border-purple-700/40"
                  >
                    <Clock className="w-4 h-4 animate-spin" /> Dispatch Active...
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartMission(m.id)}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] hover:opacity-95 text-white font-pixel text-xs flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                  >
                    <Send className="w-4 h-4" /> Accept & Deploy Squad
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
