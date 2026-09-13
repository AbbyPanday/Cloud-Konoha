import { LevelConfig } from '../types';

export const LEVELS: LevelConfig[] = [
  {
    levelNum: 1,
    title: "Bell Test at Dawn",
    location: "Training Ground 3",
    description: "Team 7's proving grounds! Leap across wooden target logs and snatch the bells from the Copy Ninja.",
    stageWidth: 2800,
    minionType: 'sound_ninja',
    boss: {
      id: 1,
      name: "Kakashi Hatake",
      title: "The Copy Ninja",
      subtitle: "Jonin Commander of Team 7",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJHLGFDBqneMvauLKbFgRvkgx1HYLZFaiyRsaRdjZVFfMQ4IaUY7MBbhu7RzPbZM2mCBak8QDAy4zsP_0RNwpxvC3pXfEbLutmuvA5tCMhkZAVVF3I0EnJRcuSJIPiD842GLGI3It1qBWysjshK7vlswjDI7eHdkMT6RP3vOj-rfNK4UuVbUHqcUpSvhthzKXHudgwdpuXcQjzCD_3gBFgDbe5gvh2Ynq9gxGhYof8je-xjInZPw",
      color: "#3b82f6",
      maxHp: 120,
      speed: 2.2,
      attackCooldown: 120,
      signatureJutsu: "Raikiri: Lightning Blade",
      arenaTheme: 'training',
      quote: "Those who break the rules are scum, but those who abandon their comrades are worse than scum!",
      specialMechanic: 'sharingan'
    },
    platforms: [
      { x: 0, y: 520, width: 800, height: 80 },
      { x: 260, y: 410, width: 140, height: 20 },
      { x: 480, y: 330, width: 160, height: 20 },
      { x: 720, y: 260, width: 150, height: 20 },
      { x: 920, y: 520, width: 700, height: 80 },
      { x: 1060, y: 390, width: 180, height: 20 },
      { x: 1320, y: 310, width: 160, height: 20 },
      { x: 1550, y: 240, width: 140, height: 20 },
      { x: 1740, y: 520, width: 1100, height: 80 }, // Boss Arena Ground
      { x: 1950, y: 380, width: 160, height: 20 },
      { x: 2320, y: 380, width: 160, height: 20 },
      { x: 2130, y: 260, width: 180, height: 20 }
    ],
    ramenPickups: [
      { x: 310, y: 370 },
      { x: 1120, y: 350 },
      { x: 1600, y: 200 },
      { x: 2180, y: 220 }
    ],
    scrollPickups: [
      { x: 530, y: 290, id: 1 },
      { x: 1380, y: 270, id: 2 },
      { x: 2600, y: 480, id: 3 }
    ],
    crates: [
      { x: 420, y: 480, content: 'ramen' },
      { x: 1220, y: 480, content: 'chakra' },
      { x: 1860, y: 480, content: 'health' }
    ],
    hazards: [
      { x: 800, y: 560, width: 120, type: 'spikes' },
      { x: 1620, y: 560, width: 120, type: 'spikes' }
    ]
  },
  {
    levelNum: 2,
    title: "Mist on the Great Bridge",
    location: "Great Naruto Bridge",
    description: "Thick fog obscures the suspension bridge. Watch for water dragon torrents and the Demon of the Mist!",
    stageWidth: 2900,
    minionType: 'mist_rogue',
    boss: {
      id: 2,
      name: "Zabuza Momochi",
      title: "Demon of the Hidden Mist",
      subtitle: "Seven Ninja Swordsmen of the Mist",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDB_c6JFGLwJAY5bdP3HEYRnZuc1_VBd33efhE94QLHDabMduHX3VPzP_Lneik7mfEuLeiqSINTBuoyA0NzjqjxIc3l9giMN55XbbhY4IBF4SehUan94ispFtzWAG9Rb0_Pl7Kb_RetJA4jO0UJvRca_JSzRrusA4AlowZPE9m_hW27ThkSbYR30Q8Ytg5CbpN1xTnX5KigZPunklSaiY_Q0Dp1ug1jnaJPesQNYBK0FmVZti_sj2Q",
      color: "#06b6d4",
      maxHp: 140,
      speed: 2.4,
      attackCooldown: 110,
      signatureJutsu: "Water Style: Water Dragon Jutsu",
      arenaTheme: 'bridge',
      quote: "When you've hovered between life and death so many times it doesn't faze you, then you may call yourself a ninja!",
      specialMechanic: 'hidden_mist'
    },
    platforms: [
      { x: 0, y: 520, width: 750, height: 80 },
      { x: 220, y: 390, width: 140, height: 20 },
      { x: 460, y: 320, width: 180, height: 20 },
      { x: 860, y: 520, width: 780, height: 80 },
      { x: 990, y: 400, width: 160, height: 20 },
      { x: 1250, y: 300, width: 180, height: 20 },
      { x: 1750, y: 520, width: 1150, height: 80 }, // Arena
      { x: 1920, y: 370, width: 160, height: 20 },
      { x: 2360, y: 370, width: 160, height: 20 }
    ],
    ramenPickups: [
      { x: 270, y: 350 },
      { x: 1320, y: 260 },
      { x: 2000, y: 330 }
    ],
    scrollPickups: [
      { x: 520, y: 280, id: 4 },
      { x: 1040, y: 360, id: 5 },
      { x: 2500, y: 480, id: 6 }
    ],
    crates: [
      { x: 380, y: 480, content: 'chakra' },
      { x: 1140, y: 480, content: 'ramen' },
      { x: 1820, y: 480, content: 'health' }
    ],
    hazards: [
      { x: 750, y: 560, width: 110, type: 'spikes' },
      { x: 1640, y: 560, width: 110, type: 'spikes' }
    ]
  },
  {
    levelNum: 3,
    title: "Forest of Death Infiltration",
    location: "Chunin Exam 44th Practice Zone",
    description: "Giant centipedes, poisonous flora, and dense canopy branches lead to the Snake Sannin's trap.",
    stageWidth: 2900,
    minionType: 'sound_ninja',
    boss: {
      id: 3,
      name: "Orochimaru",
      title: "The Legendary Sannin",
      subtitle: "Master of Forbidden Jutsu",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJHLGFDBqneMvauLKbFgRvkgx1HYLZFaiyRsaRdjZVFfMQ4IaUY7MBbhu7RzPbZM2mCBak8QDAy4zsP_0RNwpxvC3pXfEbLutmuvA5tCMhkZAVVF3I0EnJRcuSJIPiD842GLGI3It1qBWysjshK7vlswjDI7eHdkMT6RP3vOj-rfNK4UuVbUHqcUpSvhthzKXHudgwdpuXcQjzCD_3gBFgDbe5gvh2Ynq9gxGhYof8je-xjInZPw",
      color: "#a855f7",
      maxHp: 160,
      speed: 2.3,
      attackCooldown: 105,
      signatureJutsu: "Striking Shadow Snake Assault",
      arenaTheme: 'forest',
      quote: "It's human nature not to realize the true value of something unless they lose it.",
      specialMechanic: 'snakes'
    },
    platforms: [
      { x: 0, y: 520, width: 700, height: 80 },
      { x: 180, y: 410, width: 140, height: 20 },
      { x: 400, y: 320, width: 170, height: 20 },
      { x: 600, y: 240, width: 140, height: 20 },
      { x: 800, y: 520, width: 850, height: 80 },
      { x: 960, y: 410, width: 160, height: 20 },
      { x: 1220, y: 310, width: 180, height: 20 },
      { x: 1480, y: 220, width: 150, height: 20 },
      { x: 1760, y: 520, width: 1140, height: 80 },
      { x: 1960, y: 370, width: 180, height: 20 },
      { x: 2320, y: 370, width: 180, height: 20 },
      { x: 2140, y: 250, width: 180, height: 20 }
    ],
    ramenPickups: [
      { x: 230, y: 370 },
      { x: 1280, y: 270 },
      { x: 2190, y: 210 }
    ],
    scrollPickups: [
      { x: 650, y: 200, id: 7 },
      { x: 1530, y: 180, id: 8 },
      { x: 2580, y: 480, id: 9 }
    ],
    crates: [
      { x: 440, y: 480, content: 'chakra' },
      { x: 1040, y: 480, content: 'health' },
      { x: 1840, y: 480, content: 'ramen' }
    ],
    hazards: [
      { x: 700, y: 560, width: 100, type: 'acid' },
      { x: 1650, y: 560, width: 110, type: 'acid' }
    ]
  },
  {
    levelNum: 4,
    title: "Chunin Finals Colosseum",
    location: "Leaf Stadium Arena",
    description: "The roar of the crowd echoes as swirling sands fill the stone arena. Gaara's Shukaku aura awakens!",
    stageWidth: 3000,
    minionType: 'sand_puppet',
    boss: {
      id: 4,
      name: "Gaara of the Sand",
      title: "Jinchuriki of the One-Tail",
      subtitle: "The Sand Shinobi Weapon",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDB_c6JFGLwJAY5bdP3HEYRnZuc1_VBd33efhE94QLHDabMduHX3VPzP_Lneik7mfEuLeiqSINTBuoyA0NzjqjxIc3l9giMN55XbbhY4IBF4SehUan94ispFtzWAG9Rb0_Pl7Kb_RetJA4jO0UJvRca_JSzRrusA4AlowZPE9m_hW27ThkSbYR30Q8Ytg5CbpN1xTnX5KigZPunklSaiY_Q0Dp1ug1jnaJPesQNYBK0FmVZti_sj2Q",
      color: "#eab308",
      maxHp: 180,
      speed: 2.0,
      attackCooldown: 100,
      signatureJutsu: "Desert Coffin & Sand Shuriken",
      arenaTheme: 'desert',
      quote: "I fight only for myself and love only myself. As long as I think that all other people exist only to make me feel that, the world is wonderful.",
      specialMechanic: 'sand_shield'
    },
    platforms: [
      { x: 0, y: 520, width: 750, height: 80 },
      { x: 240, y: 400, width: 160, height: 20 },
      { x: 500, y: 310, width: 170, height: 20 },
      { x: 860, y: 520, width: 800, height: 80 },
      { x: 1080, y: 380, width: 180, height: 20 },
      { x: 1360, y: 280, width: 160, height: 20 },
      { x: 1780, y: 520, width: 1220, height: 80 },
      { x: 1980, y: 370, width: 200, height: 20 },
      { x: 2380, y: 370, width: 200, height: 20 },
      { x: 2180, y: 240, width: 180, height: 20 }
    ],
    ramenPickups: [
      { x: 290, y: 360 },
      { x: 1140, y: 340 },
      { x: 2240, y: 200 }
    ],
    scrollPickups: [
      { x: 550, y: 270, id: 10 },
      { x: 1410, y: 240, id: 11 },
      { x: 2680, y: 480, id: 12 }
    ],
    crates: [
      { x: 400, y: 480, content: 'ramen' },
      { x: 1240, y: 480, content: 'chakra' },
      { x: 1880, y: 480, content: 'health' }
    ],
    hazards: [
      { x: 750, y: 560, width: 110, type: 'quicksand' },
      { x: 1660, y: 560, width: 120, type: 'quicksand' }
    ]
  },
  {
    levelNum: 5,
    title: "Tanzaku Quarters Showdown",
    location: "Tanzaku Castle Ruins",
    description: "Rubble from crumbled castle towers frames the battle against the traitorous medical ninja.",
    stageWidth: 3000,
    minionType: 'sound_ninja',
    boss: {
      id: 5,
      name: "Kabuto Yakushi",
      title: "Chakra Scalpel Prodigy",
      subtitle: "Orochimaru's Right Hand",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJHLGFDBqneMvauLKbFgRvkgx1HYLZFaiyRsaRdjZVFfMQ4IaUY7MBbhu7RzPbZM2mCBak8QDAy4zsP_0RNwpxvC3pXfEbLutmuvA5tCMhkZAVVF3I0EnJRcuSJIPiD842GLGI3It1qBWysjshK7vlswjDI7eHdkMT6RP3vOj-rfNK4UuVbUHqcUpSvhthzKXHudgwdpuXcQjzCD_3gBFgDbe5gvh2Ynq9gxGhYof8je-xjInZPw",
      color: "#10b981",
      maxHp: 200,
      speed: 2.5,
      attackCooldown: 95,
      signatureJutsu: "Chakra Scalpel Sever",
      arenaTheme: 'ruins',
      quote: "A person's true power cannot be measured by physical strength alone, but by the will to endure.",
      specialMechanic: 'scalpel'
    },
    platforms: [
      { x: 0, y: 520, width: 800, height: 80 },
      { x: 260, y: 390, width: 160, height: 20 },
      { x: 520, y: 300, width: 180, height: 20 },
      { x: 920, y: 520, width: 750, height: 80 },
      { x: 1100, y: 400, width: 160, height: 20 },
      { x: 1350, y: 300, width: 170, height: 20 },
      { x: 1800, y: 520, width: 1200, height: 80 },
      { x: 1980, y: 380, width: 180, height: 20 },
      { x: 2380, y: 380, width: 180, height: 20 }
    ],
    ramenPickups: [
      { x: 310, y: 350 },
      { x: 1400, y: 260 },
      { x: 2030, y: 340 }
    ],
    scrollPickups: [
      { x: 580, y: 260, id: 13 },
      { x: 1150, y: 360, id: 14 },
      { x: 2700, y: 480, id: 15 }
    ],
    crates: [
      { x: 420, y: 480, content: 'health' },
      { x: 1200, y: 480, content: 'chakra' },
      { x: 1900, y: 480, content: 'ramen' }
    ],
    hazards: [
      { x: 800, y: 560, width: 120, type: 'spikes' },
      { x: 1670, y: 560, width: 130, type: 'spikes' }
    ]
  },
  {
    levelNum: 6,
    title: "Eastern Coast Encounter",
    location: "Crashing Waves Cliffside",
    description: "Massive ocean swells buffet the shoreline where the Monster of the Hidden Mist stands waiting with Samehada.",
    stageWidth: 3100,
    minionType: 'mist_rogue',
    boss: {
      id: 6,
      name: "Kisame Hoshigaki",
      title: "Tailless Tailed Beast",
      subtitle: "Akatsuki Cleaver of Samehada",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDB_c6JFGLwJAY5bdP3HEYRnZuc1_VBd33efhE94QLHDabMduHX3VPzP_Lneik7mfEuLeiqSINTBuoyA0NzjqjxIc3l9giMN55XbbhY4IBF4SehUan94ispFtzWAG9Rb0_Pl7Kb_RetJA4jO0UJvRca_JSzRrusA4AlowZPE9m_hW27ThkSbYR30Q8Ytg5CbpN1xTnX5KigZPunklSaiY_Q0Dp1ug1jnaJPesQNYBK0FmVZti_sj2Q",
      color: "#0284c7",
      maxHp: 230,
      speed: 2.1,
      attackCooldown: 90,
      signatureJutsu: "Water Style: Water Shark Bullet",
      arenaTheme: 'water',
      quote: "Sharks eat their own brothers inside the womb. From birth, it is kill or be killed!",
      specialMechanic: 'shark_wave'
    },
    platforms: [
      { x: 0, y: 520, width: 780, height: 80 },
      { x: 250, y: 400, width: 160, height: 20 },
      { x: 500, y: 310, width: 170, height: 20 },
      { x: 900, y: 520, width: 800, height: 80 },
      { x: 1080, y: 390, width: 160, height: 20 },
      { x: 1360, y: 290, width: 170, height: 20 },
      { x: 1820, y: 520, width: 1280, height: 80 },
      { x: 2020, y: 370, width: 200, height: 20 },
      { x: 2420, y: 370, width: 200, height: 20 },
      { x: 2220, y: 240, width: 180, height: 20 }
    ],
    ramenPickups: [
      { x: 300, y: 360 },
      { x: 1130, y: 350 },
      { x: 2270, y: 200 }
    ],
    scrollPickups: [
      { x: 550, y: 270, id: 16 },
      { x: 1410, y: 250, id: 17 },
      { x: 2750, y: 480, id: 18 }
    ],
    crates: [
      { x: 420, y: 480, content: 'ramen' },
      { x: 1240, y: 480, content: 'chakra' },
      { x: 1940, y: 480, content: 'health' }
    ],
    hazards: [
      { x: 780, y: 560, width: 120, type: 'spikes' },
      { x: 1700, y: 560, width: 120, type: 'spikes' }
    ]
  },
  {
    levelNum: 7,
    title: "Tsukuyomi Nightmare",
    location: "Shadowed Post Town Inn",
    description: "Flocks of ominous crows dissolve into illusions. The crimson Mangekyo Sharingan traps the world in red.",
    stageWidth: 3100,
    minionType: 'akatsuki_scout',
    boss: {
      id: 7,
      name: "Itachi Uchiha",
      title: "Master of the Tsukuyomi",
      subtitle: "Akatsuki Crimson Eye",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAA0qaxPIh-bcAd6zCd1DMHaEQ080U3udGKoSy7pQEaZE2ScDi3hHlPrU-YDRr36aB_6TltbiW_BBs5SgacNPMXdyZ21CJgNANodX2fnNmAwixGbAP-280CfHWl2hXmeN4dtVZpcooS4fN9pAcqGKXiSDN90hNHVBl9UBoL1B6OXQoQ1WAt9X6Oo_jveMpKsna3v9JSgHrYHbS38KqyUsMt_WfXNtgWAfXwI1IPSs8ZPyUVb3yi8zk",
      color: "#dc2626",
      maxHp: 260,
      speed: 2.6,
      attackCooldown: 85,
      signatureJutsu: "Amaterasu & Crow Genjutsu",
      arenaTheme: 'ruins',
      quote: "People live their lives bound by what they accept as correct and true. That is how they define 'reality'.",
      specialMechanic: 'amaterasu'
    },
    platforms: [
      { x: 0, y: 520, width: 750, height: 80 },
      { x: 220, y: 390, width: 160, height: 20 },
      { x: 480, y: 300, width: 170, height: 20 },
      { x: 880, y: 520, width: 800, height: 80 },
      { x: 1060, y: 390, width: 170, height: 20 },
      { x: 1340, y: 280, width: 170, height: 20 },
      { x: 1800, y: 520, width: 1300, height: 80 },
      { x: 2000, y: 370, width: 180, height: 20 },
      { x: 2400, y: 370, width: 180, height: 20 }
    ],
    ramenPickups: [
      { x: 270, y: 350 },
      { x: 1390, y: 240 },
      { x: 2050, y: 330 }
    ],
    scrollPickups: [
      { x: 530, y: 260, id: 19 },
      { x: 1110, y: 350, id: 20 },
      { x: 2760, y: 480, id: 21 }
    ],
    crates: [
      { x: 400, y: 480, content: 'chakra' },
      { x: 1200, y: 480, content: 'ramen' },
      { x: 1920, y: 480, content: 'health' }
    ],
    hazards: [
      { x: 750, y: 560, width: 130, type: 'spikes' },
      { x: 1680, y: 560, width: 120, type: 'spikes' }
    ]
  },
  {
    levelNum: 8,
    title: "Valley of the End: Final Clash",
    location: "The Two Giant Stone Statues",
    description: "Rain pounds the water gorge between Madara and Hashirama. Two best friends settle their destiny with Rasengan vs Chidori!",
    stageWidth: 3200,
    minionType: 'sound_ninja',
    boss: {
      id: 8,
      name: "Curse Mark Sasuke",
      title: "Avenger of the Uchiha",
      subtitle: "Bearer of the Cursed Seal Stage 2",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAA0qaxPIh-bcAd6zCd1DMHaEQ080U3udGKoSy7pQEaZE2ScDi3hHlPrU-YDRr36aB_6TltbiW_BBs5SgacNPMXdyZ21CJgNANodX2fnNmAwixGbAP-280CfHWl2hXmeN4dtVZpcooS4fN9pAcqGKXiSDN90hNHVBl9UBoL1B6OXQoQ1WAt9X6Oo_jveMpKsna3v9JSgHrYHbS38KqyUsMt_WfXNtgWAfXwI1IPSs8ZPyUVb3yi8zk",
      color: "#8b5cf6",
      maxHp: 280,
      speed: 2.8,
      attackCooldown: 80,
      signatureJutsu: "Black Chidori: Lament",
      arenaTheme: 'valley',
      quote: "I have already severed my ties to the past! You will not stop me, Naruto!",
      specialMechanic: 'curse_mark'
    },
    platforms: [
      { x: 0, y: 520, width: 800, height: 80 },
      { x: 260, y: 390, width: 170, height: 20 },
      { x: 520, y: 290, width: 180, height: 20 },
      { x: 920, y: 520, width: 800, height: 80 },
      { x: 1120, y: 390, width: 170, height: 20 },
      { x: 1400, y: 290, width: 170, height: 20 },
      { x: 1840, y: 520, width: 1360, height: 80 },
      { x: 2060, y: 370, width: 220, height: 20 },
      { x: 2500, y: 370, width: 220, height: 20 },
      { x: 2280, y: 230, width: 200, height: 20 }
    ],
    ramenPickups: [
      { x: 310, y: 350 },
      { x: 1170, y: 350 },
      { x: 2330, y: 190 }
    ],
    scrollPickups: [
      { x: 570, y: 250, id: 22 },
      { x: 1450, y: 250, id: 23 },
      { x: 2850, y: 480, id: 24 }
    ],
    crates: [
      { x: 440, y: 480, content: 'ramen' },
      { x: 1260, y: 480, content: 'chakra' },
      { x: 1960, y: 480, content: 'health' }
    ],
    hazards: [
      { x: 800, y: 560, width: 120, type: 'spikes' },
      { x: 1720, y: 560, width: 120, type: 'spikes' }
    ]
  },
  {
    levelNum: 9,
    title: "Sand Village Air Assault",
    location: "Sunagakure Sky Heights",
    description: "Giant clay birds swoop from above dropping explosive spiders and centipedes across the sandstone pinnacles.",
    stageWidth: 3200,
    minionType: 'clay_crawler',
    boss: {
      id: 9,
      name: "Deidara",
      title: "The Explosive Artist",
      subtitle: "Akatsuki Demolition Maestro",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDB_c6JFGLwJAY5bdP3HEYRnZuc1_VBd33efhE94QLHDabMduHX3VPzP_Lneik7mfEuLeiqSINTBuoyA0NzjqjxIc3l9giMN55XbbhY4IBF4SehUan94ispFtzWAG9Rb0_Pl7Kb_RetJA4jO0UJvRca_JSzRrusA4AlowZPE9m_hW27ThkSbYR30Q8Ytg5CbpN1xTnX5KigZPunklSaiY_Q0Dp1ug1jnaJPesQNYBK0FmVZti_sj2Q",
      color: "#f59e0b",
      maxHp: 300,
      speed: 2.7,
      attackCooldown: 75,
      signatureJutsu: "C3: Ohako Giant Clay Bomb",
      arenaTheme: 'sky',
      quote: "Art is an EXPLOSION! True beauty lies in a fleeting flash of absolute brilliance!",
      specialMechanic: 'clay_bombs'
    },
    platforms: [
      { x: 0, y: 520, width: 750, height: 80 },
      { x: 230, y: 400, width: 160, height: 20 },
      { x: 480, y: 310, width: 170, height: 20 },
      { x: 860, y: 520, width: 850, height: 80 },
      { x: 1080, y: 390, width: 170, height: 20 },
      { x: 1360, y: 280, width: 180, height: 20 },
      { x: 1830, y: 520, width: 1370, height: 80 },
      { x: 2040, y: 370, width: 200, height: 20 },
      { x: 2460, y: 370, width: 200, height: 20 }
    ],
    ramenPickups: [
      { x: 280, y: 360 },
      { x: 1410, y: 240 },
      { x: 2100, y: 330 }
    ],
    scrollPickups: [
      { x: 530, y: 270, id: 25 },
      { x: 1130, y: 350, id: 26 },
      { x: 2880, y: 480, id: 27 }
    ],
    crates: [
      { x: 400, y: 480, content: 'health' },
      { x: 1220, y: 480, content: 'chakra' },
      { x: 1950, y: 480, content: 'ramen' }
    ],
    hazards: [
      { x: 750, y: 560, width: 110, type: 'quicksand' },
      { x: 1710, y: 560, width: 120, type: 'quicksand' }
    ]
  },
  {
    levelNum: 10,
    title: "Devastation of the Leaf",
    location: "Crater of the Hidden Leaf",
    description: "The entire village is reduced to a colossal scorched crater. Stand alone against God to protect everyone's ninja way!",
    stageWidth: 3400,
    minionType: 'akatsuki_scout',
    boss: {
      id: 10,
      name: "Pain (Deva Path)",
      title: "God of the Six Paths",
      subtitle: "Leader of the Akatsuki",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAA0qaxPIh-bcAd6zCd1DMHaEQ080U3udGKoSy7pQEaZE2ScDi3hHlPrU-YDRr36aB_6TltbiW_BBs5SgacNPMXdyZ21CJgNANodX2fnNmAwixGbAP-280CfHWl2hXmeN4dtVZpcooS4fN9pAcqGKXiSDN90hNHVBl9UBoL1B6OXQoQ1WAt9X6Oo_jveMpKsna3v9JSgHrYHbS38KqyUsMt_WfXNtgWAfXwI1IPSs8ZPyUVb3yi8zk",
      color: "#ef4444",
      maxHp: 350,
      speed: 3.0,
      attackCooldown: 70,
      signatureJutsu: "Almighty Push: Shinra Tensei",
      arenaTheme: 'ruins',
      quote: "Feel pain. Contemplate pain. Accept pain. Know pain. Those who do not understand true pain can never comprehend true peace!",
      specialMechanic: 'shinra_tensei'
    },
    platforms: [
      { x: 0, y: 520, width: 800, height: 80 },
      { x: 260, y: 390, width: 180, height: 20 },
      { x: 520, y: 290, width: 180, height: 20 },
      { x: 920, y: 520, width: 850, height: 80 },
      { x: 1140, y: 390, width: 180, height: 20 },
      { x: 1420, y: 280, width: 180, height: 20 },
      { x: 1880, y: 520, width: 1520, height: 80 }, // Massive Final Boss Arena
      { x: 2100, y: 370, width: 220, height: 20 },
      { x: 2580, y: 370, width: 220, height: 20 },
      { x: 2340, y: 230, width: 220, height: 20 }
    ],
    ramenPickups: [
      { x: 310, y: 350 },
      { x: 1200, y: 350 },
      { x: 2390, y: 190 }
    ],
    scrollPickups: [
      { x: 570, y: 250, id: 28 },
      { x: 1470, y: 240, id: 29 },
      { x: 3000, y: 480, id: 30 }
    ],
    crates: [
      { x: 440, y: 480, content: 'ramen' },
      { x: 1260, y: 480, content: 'chakra' },
      { x: 2000, y: 480, content: 'health' }
    ],
    hazards: [
      { x: 800, y: 560, width: 120, type: 'spikes' },
      { x: 1770, y: 560, width: 110, type: 'spikes' }
    ]
  }
];
