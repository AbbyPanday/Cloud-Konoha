import React, { useState } from 'react';
import { sound } from '../game/sound';
import {
  MapPin,
  Shield,
  Wind,
  Compass,
  Zap,
  Play,
  Crosshair,
  Info
} from 'lucide-react';

interface VillageMapProps {
  onSelectLevel: (levelNum: number) => void;
  onOpenRamen: () => void;
}

interface PointOfInterest {
  id: string;
  name: string;
  category: string;
  x: number; // percentage
  y: number; // percentage
  levelNum?: number;
  isRamen?: boolean;
  description: string;
  threatLevel: 'Safe' | 'Moderate' | 'Severe' | 'Extreme';
  guard: string;
}

const POIS: PointOfInterest[] = [
  {
    id: 'hokage',
    name: 'Hokage Residence',
    category: 'Village Command',
    x: 48,
    y: 28,
    description: 'The executive summit of the Hidden Leaf. Lady Tsunade issues high-priority S-rank dispatches from this terrace overlooking the Hokage Monument.',
    threatLevel: 'Safe',
    guard: 'ANBU Black Ops'
  },
  {
    id: 'training3',
    name: 'Training Ground 3',
    category: 'Team 7 Bell Test',
    x: 28,
    y: 62,
    levelNum: 1,
    description: 'Team 7 proving grounds with three wooden logs. Kakashi tests your resolve and teamwork before sunset.',
    threatLevel: 'Moderate',
    guard: 'Kakashi Hatake'
  },
  {
    id: 'ichiraku',
    name: 'Ichiraku Ramen Stall',
    category: 'Culinary Hearth',
    x: 62,
    y: 56,
    isRamen: true,
    description: 'Teuchi and Ayame serve the legendary tonkotsu miso broth that fuels Naruto’s boundless chakra and determination.',
    threatLevel: 'Safe',
    guard: 'Teuchi'
  },
  {
    id: 'stadium',
    name: 'Chunin Exam Stadium',
    category: 'Colosseum Arena',
    x: 75,
    y: 38,
    levelNum: 4,
    description: 'The monumental tiered colosseum where Genin duel before feudal lords. Gaara’s sand storm threatens the village!',
    threatLevel: 'Severe',
    guard: 'Proctor Genma'
  },
  {
    id: 'bridge',
    name: 'Great Naruto Bridge',
    category: 'Mist Outpost',
    x: 18,
    y: 40,
    levelNum: 2,
    description: 'The vast suspension bridge connecting the Land of Waves to the continent. Zabuza’s silent killing fog lingers on the cables.',
    threatLevel: 'Severe',
    guard: 'Tazuna the Builder'
  },
  {
    id: 'valley',
    name: 'Valley of the End',
    category: 'Destiny Gorge',
    x: 88,
    y: 68,
    levelNum: 8,
    description: 'The titanic stone statues of Hashirama and Madara clash above the roaring waterfall. The ultimate battle between Naruto and Sasuke.',
    threatLevel: 'Extreme',
    guard: 'Cursed Seal Vanguard'
  }
];

export const VillageMap: React.FC<VillageMapProps> = ({ onSelectLevel, onOpenRamen }) => {
  const [selectedPoi, setSelectedPoi] = useState<PointOfInterest>(POIS[0]);

  const handleSelectPoi = (poi: PointOfInterest) => {
    sound.click();
    setSelectedPoi(poi);
  };

  const handleAction = () => {
    if (selectedPoi.isRamen) {
      onOpenRamen();
    } else if (selectedPoi.levelNum) {
      onSelectLevel(selectedPoi.levelNum);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto px-2 sm:px-4 py-3">
      {/* Header & Telemetry Bar */}
      <div className="bg-[#0f172a]/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-xs text-[#06b6d4] uppercase tracking-wider">
              Konohagakure Tactical Sector Map
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 text-[10px] font-bold">
              BARRIER ACTIVE
            </span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
            Hidden Leaf Strategic Topography
          </h2>
        </div>

        {/* Tactical Indicators */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <Shield className="w-4 h-4 text-[#06b6d4]" />
            <span>Barrier Integrity: <strong className="text-white">99.4%</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <Wind className="w-4 h-4 text-[#fbbf24]" />
            <span>Chakra Wind: <strong className="text-white">SE 14kt</strong></span>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Interactive Map Visual */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-2xl aspect-[16/9] group">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuARm5oKrOYzexu9Ph8WUnebQ0vtztqC2i6KmBYCP4i9ENeaogADN1FCZlho_RCagFx5QAdMwIYh-IvjMqJ5RCIXEOLqXQS3XOwCQs1tUpSlkY9a6q41W7REIWMLv7zljABd_4S7I6doKlUk1hHxUDTXQAiKNjIHYjjmr-Rnpm5pwfW8ZeoRjewsj1JOWmZ24fKTVz_6HkjDJawdKHh36Tc4LMgGTFTh5MdFmpMV5Dj3zLDLpR4jIM8"
            alt="Leaf Village Tactical Map"
            className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-700"
            referrerPolicy="no-referrer"
          />

          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff0d_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff0d_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          {/* Interactive POI Pins */}
          {POIS.map(poi => {
            const isSelected = selectedPoi.id === poi.id;
            return (
              <button
                key={poi.id}
                onClick={() => handleSelectPoi(poi)}
                style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/pin transition-all z-20 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
              >
                {/* Ping wave */}
                {isSelected && (
                  <span className="absolute w-8 h-8 rounded-full bg-[#00f0ff]/40 animate-ping" />
                )}

                {/* Marker Badge */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${
                    isSelected
                      ? 'bg-[#ff6a00] border-white text-white shadow-[0_0_15px_rgba(255,106,0,0.8)]'
                      : poi.isRamen
                      ? 'bg-[#f59e0b] border-amber-300 text-black'
                      : 'bg-slate-900/90 border-[#06b6d4] text-[#06b6d4]'
                  }`}
                >
                  {poi.isRamen ? (
                    <span className="text-xs">🍜</span>
                  ) : poi.levelNum ? (
                    <span className="text-[10px] font-pixel font-bold">L{poi.levelNum}</span>
                  ) : (
                    <MapPin className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Label Tag */}
                <span
                  className={`mt-1 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-md transition-all ${
                    isSelected
                      ? 'bg-[#ff6a00] text-white border border-white'
                      : 'bg-black/80 text-slate-200 border border-slate-700'
                  }`}
                >
                  {poi.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* POI Intel & Action Sidebar */}
        <div className="bg-[#0f172a]/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-pixel text-[#ff6a00] uppercase tracking-wider">
                {selectedPoi.category}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedPoi.threatLevel === 'Extreme'
                    ? 'bg-red-950 text-red-400 border border-red-800'
                    : selectedPoi.threatLevel === 'Severe'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : selectedPoi.threatLevel === 'Moderate'
                    ? 'bg-blue-950 text-blue-400 border border-blue-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}
              >
                Threat: {selectedPoi.threatLevel}
              </span>
            </div>

            <h3 className="font-cinzel text-2xl font-bold text-white">
              {selectedPoi.name}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              {selectedPoi.description}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                <span>Assigned Shinobi / Overseer:</span>
                <span className="text-white font-medium">{selectedPoi.guard}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                <span>Coordinates:</span>
                <span className="font-mono text-[#00f0ff]">{selectedPoi.x}°N, {selectedPoi.y}°E</span>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div>
            {selectedPoi.levelNum ? (
              <button
                onClick={handleAction}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff6a00] to-[#ea580c] hover:opacity-95 text-white font-pixel text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,106,0,0.5)] transition-all"
              >
                <Play className="w-4 h-4" /> Launch Stage #{selectedPoi.levelNum} Battle
              </button>
            ) : selectedPoi.isRamen ? (
              <button
                onClick={handleAction}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:opacity-95 text-black font-pixel text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all font-bold"
              >
                <span>🍜</span> Enter Ichiraku Ramen Stall
              </button>
            ) : (
              <button
                onClick={() => onSelectLevel(1)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
              >
                <Crosshair className="w-4 h-4 text-[#00f0ff]" /> Deploy to Active Campaign
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
