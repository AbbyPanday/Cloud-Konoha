import { LevelConfig, PlayerStats } from '../types';
import { sound } from './sound';

export interface GameCallbacks {
  onStatsUpdate: (stats: { hp: number; maxHp: number; chakra: number; maxChakra: number; score: number; ryo: number; scrolls: number }) => void;
  onLevelComplete: (levelNum: number, score: number, scrollsCollected: number) => void;
  onGameOver: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  type?: 'circle' | 'petal' | 'smoke' | 'spark' | 'flame';
  rotation?: number;
  vRot?: number;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  fromPlayer: boolean;
  type: 'rasengan' | 'shuriken' | 'kunai' | 'chidori' | 'water_shark' | 'clay_spider' | 'amaterasu' | 'pain_rod';
  life: number;
  color: string;
  rotation?: number;
}

interface Minion {
  x: number;
  y: number;
  vx: number;
  width: number;
  height: number;
  hp: number;
  type: string;
  attackCooldown: number;
  facing: number;
  alive: boolean;
}

interface Collectible {
  x: number;
  y: number;
  type: 'ramen' | 'scroll' | 'chakra' | 'coin';
  collected: boolean;
  id?: number;
  bobOffset: number;
}

interface Crate {
  x: number;
  y: number;
  width: number;
  height: number;
  content: 'chakra' | 'health' | 'ramen';
  broken: boolean;
}

export class GameEngine {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  private level: LevelConfig;
  private callbacks: GameCallbacks;

  // Game Loop
  private running: boolean = false;
  private paused: boolean = false;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;

  // Viewport & Dimensions
  public viewWidth: number = 960;
  public viewHeight: number = 600;
  public cameraX: number = 0;

  // Player State
  public player = {
    x: 100,
    y: 400,
    vx: 0,
    vy: 0,
    width: 32,
    height: 50,
    facing: 1, // 1: right, -1: left
    onGround: false,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    isJumping: false,
    invincibleTimer: 0,
    dashTimer: 0,
    dashCooldown: 0,
    isDashing: false,
    hp: 3,
    maxHp: 3,
    chakra: 100,
    maxChakra: 100,
    score: 0,
    ryo: 0,
    scrollsFound: 0,
    animFrame: 0,
    animTimer: 0,
    state: 'idle' as 'idle' | 'run' | 'jump' | 'fall' | 'dash' | 'attack'
  };

  // Boss State
  public bossState = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    width: 44,
    height: 58,
    facing: -1,
    hp: 100,
    maxHp: 100,
    active: false,
    phase: 1,
    actionTimer: 0,
    state: 'idle' as 'idle' | 'telegraph' | 'charge' | 'jutsu' | 'hurt' | 'retreat',
    shield: false,
    invincibleTimer: 0,
    defeated: false,
    quoteTimer: 0
  };

  // Entities
  private minions: Minion[] = [];
  private projectiles: Projectile[] = [];
  private particles: Particle[] = [];
  private collectibles: Collectible[] = [];
  private crates: Crate[] = [];

  // Inputs
  public keys: { [key: string]: boolean } = {};
  public externalBuff = {
    atkMultiplier: 1.0,
    speedBoost: 1.0,
    chakraRegen: 1.0,
    maxHpBoost: 0
  };

  constructor(canvas: HTMLCanvasElement, level: LevelConfig, callbacks: GameCallbacks, buff?: PlayerStats['activeBuff']) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.level = level;
    this.callbacks = callbacks;
    if (buff) {
      this.externalBuff = {
        atkMultiplier: buff.atkMultiplier,
        speedBoost: buff.speedBoost,
        chakraRegen: buff.chakraRegen,
        maxHpBoost: 0
      };
    }

    this.initLevel();
  }

  public setBuff(buff?: PlayerStats['activeBuff']) {
    if (buff) {
      this.externalBuff = {
        atkMultiplier: buff.atkMultiplier,
        speedBoost: buff.speedBoost,
        chakraRegen: buff.chakraRegen,
        maxHpBoost: 0
      };
    }
  }

  public initLevel(newLevel?: LevelConfig) {
    if (newLevel) {
      this.level = newLevel;
    }

    // Reset Player
    this.player.x = 100;
    this.player.y = 440;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.hp = this.player.maxHp;
    this.player.chakra = this.player.maxChakra;
    this.player.invincibleTimer = 0;
    this.player.dashTimer = 0;
    this.player.dashCooldown = 0;
    this.player.scrollsFound = 0;
    this.cameraX = 0;

    // Reset Boss
    const bossArenaX = this.level.stageWidth - 650;
    this.bossState.x = bossArenaX;
    this.bossState.y = 440;
    this.bossState.vx = 0;
    this.bossState.vy = 0;
    this.bossState.hp = this.level.boss.maxHp;
    this.bossState.maxHp = this.level.boss.maxHp;
    this.bossState.active = false;
    this.bossState.actionTimer = 60;
    this.bossState.state = 'idle';
    this.bossState.shield = false;
    this.bossState.invincibleTimer = 0;
    this.bossState.defeated = false;
    this.bossState.quoteTimer = 180;

    // Populate Collectibles
    this.collectibles = [];
    this.level.ramenPickups.forEach(r => {
      this.collectibles.push({ x: r.x, y: r.y, type: 'ramen', collected: false, bobOffset: Math.random() * 6 });
    });
    this.level.scrollPickups.forEach(s => {
      this.collectibles.push({ x: s.x, y: s.y, type: 'scroll', collected: false, id: s.id, bobOffset: Math.random() * 6 });
    });

    // Populate Crates
    this.crates = this.level.crates.map(c => ({
      x: c.x,
      y: c.y,
      width: 36,
      height: 36,
      content: c.content,
      broken: false
    }));

    // Populate Minions along the stage (before boss arena)
    this.minions = [];
    const minionCount = Math.floor((this.level.stageWidth - 1000) / 450);
    for (let i = 1; i <= minionCount; i++) {
      const mx = 350 + i * 420 + (Math.random() * 60 - 30);
      this.minions.push({
        x: mx,
        y: 440,
        vx: (i % 2 === 0 ? 1 : -1) * 1.2,
        width: 32,
        height: 46,
        hp: 30,
        type: this.level.minionType,
        attackCooldown: 120 + Math.floor(Math.random() * 60),
        facing: -1,
        alive: true
      });
    }

    this.projectiles = [];
    this.particles = [];

    // Ambient Sakura Petals
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random() * this.level.stageWidth,
        y: Math.random() * this.viewHeight,
        vx: 0.8 + Math.random() * 1.2,
        vy: 0.5 + Math.random() * 0.8,
        size: 3 + Math.random() * 3,
        color: '#f472b6',
        alpha: 0.4 + Math.random() * 0.4,
        decay: 0,
        type: 'petal',
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.05
      });
    }

    this.notifyStats();
  }

  private notifyStats() {
    this.callbacks.onStatsUpdate({
      hp: this.player.hp,
      maxHp: this.player.maxHp,
      chakra: Math.floor(this.player.chakra),
      maxChakra: this.player.maxChakra,
      score: this.player.score,
      ryo: this.player.ryo,
      scrolls: this.player.scrollsFound
    });
  }

  public start() {
    if (!this.running) {
      this.running = true;
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  public stop() {
    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public togglePause(): boolean {
    this.paused = !this.paused;
    return this.paused;
  }

  public isPaused(): boolean {
    return this.paused;
  }

  // --- ACTIONS (Keyboard / On-screen buttons) ---
  public actionJump() {
    if (this.paused || !this.running) return;
    this.player.jumpBufferTimer = 6;
  }

  public actionRasengan() {
    if (this.paused || !this.running) return;
    if (this.player.chakra >= 25) {
      this.player.chakra -= 25;
      sound.rasengan();

      const pX = this.player.facing === 1 ? this.player.x + this.player.width + 4 : this.player.x - 16;
      this.projectiles.push({
        x: pX,
        y: this.player.y + 16,
        vx: this.player.facing * 8.5,
        vy: 0,
        radius: 12,
        damage: 40 * this.externalBuff.atkMultiplier,
        fromPlayer: true,
        type: 'rasengan',
        life: 75,
        color: '#00f0ff',
        rotation: 0
      });

      // Chakra burst particles
      for (let i = 0; i < 15; i++) {
        this.particles.push({
          x: pX,
          y: this.player.y + 20,
          vx: (Math.random() - 0.5) * 5 + this.player.facing * 3,
          vy: (Math.random() - 0.5) * 5,
          size: 3 + Math.random() * 3,
          color: i % 2 === 0 ? '#00f0ff' : '#38bdf8',
          alpha: 1,
          decay: 0.04,
          type: 'spark'
        });
      }
      this.notifyStats();
    }
  }

  public actionShunshin() {
    if (this.paused || !this.running) return;
    if (this.player.chakra >= 15 && this.player.dashCooldown <= 0) {
      this.player.chakra -= 15;
      this.player.dashTimer = 14;
      this.player.dashCooldown = 35;
      this.player.isDashing = true;
      this.player.invincibleTimer = 22;
      sound.shunshin();

      // Ghost trail particles
      for (let i = 0; i < 3; i++) {
        this.particles.push({
          x: this.player.x,
          y: this.player.y,
          vx: 0,
          vy: 0,
          size: 32,
          color: '#00f0ff',
          alpha: 0.6,
          decay: 0.08,
          type: 'smoke'
        });
      }
      this.notifyStats();
    }
  }

  public actionCloneBurst() {
    if (this.paused || !this.running) return;
    if (this.player.chakra >= 30) {
      this.player.chakra -= 30;
      sound.clone();

      // Super double jump boost!
      this.player.vy = -10.5;
      this.player.isJumping = true;
      this.player.invincibleTimer = 18;

      // Spawn smoke puff
      for (let i = 0; i < 24; i++) {
        this.particles.push({
          x: this.player.x + 16,
          y: this.player.y + 24,
          vx: (Math.random() - 0.5) * 7,
          vy: (Math.random() - 0.5) * 7,
          size: 8 + Math.random() * 10,
          color: '#e2e8f0',
          alpha: 0.9,
          decay: 0.03,
          type: 'smoke'
        });
      }

      // Damage nearby minions & boss
      this.minions.forEach(m => {
        if (m.alive && Math.abs(m.x - this.player.x) < 110 && Math.abs(m.y - this.player.y) < 70) {
          m.hp -= 25 * this.externalBuff.atkMultiplier;
          m.vx = (m.x > this.player.x ? 1 : -1) * 4;
          sound.hit();
          if (m.hp <= 0) {
            m.alive = false;
            this.player.score += 250;
            this.player.ryo += 30;
          }
        }
      });

      if (this.bossState.active && !this.bossState.defeated) {
        if (Math.abs(this.bossState.x - this.player.x) < 120 && Math.abs(this.bossState.y - this.player.y) < 80) {
          this.damageBoss(20 * this.externalBuff.atkMultiplier);
        }
      }

      this.notifyStats();
    }
  }

  // --- GAME LOOP ---
  private loop = (currentTime: number) => {
    if (!this.running) return;
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    if (!this.paused) {
      this.update(dt);
    }
    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  // --- UPDATE ---
  private update(_dt: number) {
    // 1. Passive Chakra Regeneration
    if (this.player.chakra < this.player.maxChakra) {
      this.player.chakra = Math.min(this.player.maxChakra, this.player.chakra + 0.12 * this.externalBuff.chakraRegen);
      if (Math.floor(this.player.chakra) % 10 === 0) {
        this.notifyStats();
      }
    }

    // 2. Dash / Cooldown Timers
    if (this.player.dashCooldown > 0) this.player.dashCooldown--;
    if (this.player.dashTimer > 0) {
      this.player.dashTimer--;
      this.player.vx = this.player.facing * 14 * this.externalBuff.speedBoost;
      if (this.player.dashTimer === 0) {
        this.player.isDashing = false;
      }
    } else {
      // Standard Left / Right Movement
      const speed = 4.2 * this.externalBuff.speedBoost;
      const moveLeft = this.keys['ArrowLeft'] || this.keys['KeyA'] || this.keys['a'];
      const moveRight = this.keys['ArrowRight'] || this.keys['KeyD'] || this.keys['d'];

      if (moveLeft && !moveRight) {
        this.player.vx = -speed;
        this.player.facing = -1;
      } else if (moveRight && !moveLeft) {
        this.player.vx = speed;
        this.player.facing = 1;
      } else {
        this.player.vx *= 0.82; // Ground friction
        if (Math.abs(this.player.vx) < 0.2) this.player.vx = 0;
      }
    }

    // 3. Jump Logic (Coyote Time + Jump Buffering + Variable Jump)
    if (this.player.onGround) {
      this.player.coyoteTimer = 5;
    } else {
      if (this.player.coyoteTimer > 0) this.player.coyoteTimer--;
    }

    if (this.player.jumpBufferTimer > 0) {
      this.player.jumpBufferTimer--;
      if (this.player.coyoteTimer > 0) {
        this.player.vy = -12.5;
        this.player.onGround = false;
        this.player.coyoteTimer = 0;
        this.player.jumpBufferTimer = 0;
        this.player.isJumping = true;
        sound.jump();
      }
    }

    // Check keyboard jump key (W / Up / Space)
    const jumpHeld = this.keys['ArrowUp'] || this.keys['KeyW'] || this.keys['w'] || this.keys['Space'] || this.keys[' '];
    if (jumpHeld && this.player.onGround) {
      this.player.jumpBufferTimer = 4;
    }
    // Variable jump: cut upward velocity if jump key released early
    if (!jumpHeld && this.player.vy < -3) {
      this.player.vy *= 0.55;
    }

    // 4. Gravity & Physics
    this.player.vy += 0.55; // Gravity
    if (this.player.vy > 12) this.player.vy = 12; // Terminal velocity

    // Move X
    this.player.x += this.player.vx;

    // Boss Arena Left Wall Lock: Once boss activated, player cannot retreat!
    if (this.bossState.active) {
      const bossArenaMinX = this.level.stageWidth - 1100;
      if (this.player.x < bossArenaMinX) {
        this.player.x = bossArenaMinX;
        this.player.vx = 0;
      }
    } else if (this.player.x < 0) {
      this.player.x = 0;
      this.player.vx = 0;
    }

    if (this.player.x > this.level.stageWidth - this.player.width) {
      this.player.x = this.level.stageWidth - this.player.width;
      this.player.vx = 0;
    }

    // Move Y & Platform Collisions
    const prevY = this.player.y;
    this.player.y += this.player.vy;
    this.player.onGround = false;

    // Drop through platforms if pressing down
    const pressingDown = this.keys['ArrowDown'] || this.keys['KeyS'] || this.keys['s'];

    for (const plat of this.level.platforms) {
      // Check horizontal overlap
      if (this.player.x + this.player.width > plat.x && this.player.x < plat.x + plat.width) {
        // One-way landing from above
        if (prevY + this.player.height <= plat.y && this.player.y + this.player.height >= plat.y) {
          if (!pressingDown || !plat.oneWay) {
            this.player.y = plat.y - this.player.height;
            this.player.vy = 0;
            this.player.onGround = true;
            this.player.isJumping = false;
            break;
          }
        }
      }
    }

    // Bottom pit fall check
    if (this.player.y > this.viewHeight + 40) {
      this.damagePlayer(1);
      // Respawn on nearest ground
      this.player.y = 380;
      this.player.x = Math.max(100, this.player.x - 200);
      this.player.vy = 0;
    }

    // Hazard Collisions
    this.level.hazards.forEach(h => {
      if (this.player.x + this.player.width > h.x && this.player.x < h.x + h.width && this.player.y + this.player.height >= h.y) {
        this.damagePlayer(1);
        this.player.vy = -8;
      }
    });

    // 5. Camera Tracking
    const targetCamX = this.player.x - this.viewWidth * 0.38;
    this.cameraX += (targetCamX - this.cameraX) * 0.12;
    this.cameraX = Math.max(0, Math.min(this.cameraX, this.level.stageWidth - this.viewWidth));

    // Boss Activation trigger
    const bossTriggerX = this.level.stageWidth - 1150;
    if (this.player.x >= bossTriggerX && !this.bossState.active && !this.bossState.defeated) {
      this.bossState.active = true;
      sound.kyuubiRoar();
    }

    // 6. Collectibles Update & Collision
    this.collectibles.forEach(c => {
      if (!c.collected) {
        c.bobOffset += 0.05;
        const cy = c.y + Math.sin(c.bobOffset) * 5;
        if (
          this.player.x + this.player.width > c.x &&
          this.player.x < c.x + 28 &&
          this.player.y + this.player.height > cy &&
          this.player.y < cy + 28
        ) {
          c.collected = true;
          if (c.type === 'ramen') {
            sound.ramen();
            this.player.chakra = Math.min(this.player.maxChakra, this.player.chakra + 35);
            this.player.score += 200;
            // Pop floating text particles
            this.createFloatingText(c.x, c.y, '+35 CHAKRA', '#00f0ff');
          } else if (c.type === 'scroll') {
            sound.scroll();
            this.player.scrollsFound++;
            this.player.score += 500;
            this.createFloatingText(c.x, c.y, 'NINJA SCROLL!', '#fbbf24');
          }
          this.notifyStats();
        }
      }
    });

    // 7. Crates Update & Stomp / Hit
    this.crates.forEach(c => {
      if (!c.broken) {
        // Player stomp or touch check
        const playerBottom = this.player.y + this.player.height;
        if (
          this.player.x + this.player.width > c.x &&
          this.player.x < c.x + c.width &&
          playerBottom >= c.y &&
          this.player.y < c.y + c.height
        ) {
          // If falling onto crate or dashing: break it!
          if (this.player.vy > 0 || this.player.isDashing) {
            c.broken = true;
            sound.crate();
            this.player.vy = -7; // Stomp bounce
            this.createCrateSplinters(c.x + 18, c.y + 18);
            if (c.content === 'ramen') {
              this.collectibles.push({ x: c.x, y: c.y - 20, type: 'ramen', collected: false, bobOffset: 0 });
            } else if (c.content === 'chakra') {
              this.player.chakra = Math.min(this.player.maxChakra, this.player.chakra + 50);
              this.createFloatingText(c.x, c.y, '+50 CHAKRA', '#38bdf8');
            } else if (c.content === 'health') {
              this.player.hp = Math.min(this.player.maxHp, this.player.hp + 1);
              this.createFloatingText(c.x, c.y, '+1 HEART', '#ef4444');
            }
            this.notifyStats();
          } else {
            // Act as solid obstacle
            if (this.player.vx > 0) this.player.x = c.x - this.player.width;
            if (this.player.vx < 0) this.player.x = c.x + c.width;
          }
        }
      }
    });

    // 8. Minions Update & Mario-style Stomp
    this.minions.forEach(m => {
      if (m.alive) {
        m.x += m.vx;
        m.facing = m.vx > 0 ? 1 : -1;

        // Turn around at platform edges
        let onPlat = false;
        for (const p of this.level.platforms) {
          if (m.x + m.width > p.x && m.x < p.x + p.width && Math.abs(m.y + m.height - p.y) < 10) {
            onPlat = true;
            if (m.x <= p.x || m.x + m.width >= p.x + p.width) {
              m.vx *= -1;
            }
            break;
          }
        }
        if (!onPlat) m.vx *= -1;

        // Minion Attack: Shoot occasional shuriken if player within range
        m.attackCooldown--;
        if (m.attackCooldown <= 0 && Math.abs(this.player.x - m.x) < 320) {
          m.attackCooldown = 140;
          const dir = this.player.x > m.x ? 1 : -1;
          this.projectiles.push({
            x: m.x + (dir === 1 ? m.width + 2 : -10),
            y: m.y + 18,
            vx: dir * 5.5,
            vy: 0,
            radius: 6,
            damage: 1,
            fromPlayer: false,
            type: 'shuriken',
            life: 80,
            color: '#94a3b8',
            rotation: 0
          });
        }

        // Mario-Style Stomp & Collision with Player
        if (
          this.player.x + this.player.width > m.x &&
          this.player.x < m.x + m.width &&
          this.player.y + this.player.height > m.y &&
          this.player.y < m.y + m.height
        ) {
          // Landing on top while falling (Stomp mechanic!)
          if (this.player.vy > 0 && this.player.y + this.player.height - m.y < 22) {
            m.alive = false;
            this.player.vy = -9.2; // Bounce!
            this.player.score += 200;
            this.player.ryo += 20;
            sound.stomp();
            this.createImpactSparks(m.x + 16, m.y + 10, '#f97316');
            this.notifyStats();
          } else if (this.player.isDashing) {
            // Shunshin dash kills minion
            m.alive = false;
            this.player.score += 200;
            this.player.ryo += 20;
            sound.hit();
            this.createImpactSparks(m.x + 16, m.y + 20, '#00f0ff');
            this.notifyStats();
          } else {
            // Hurt player
            this.damagePlayer(1);
          }
        }
      }
    });

    // 9. Boss AI & Mechanics
    if (this.bossState.active && !this.bossState.defeated) {
      this.updateBoss();
    }

    // 10. Projectiles Update
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      p.rotation = (p.rotation || 0) + 0.25;

      // Projectile vs Minions
      if (p.fromPlayer) {
        this.minions.forEach(m => {
          if (m.alive && Math.abs(m.x + 16 - p.x) < 22 && Math.abs(m.y + 23 - p.y) < 26) {
            m.hp -= p.damage;
            p.life = 0;
            sound.hit();
            this.createImpactSparks(p.x, p.y, '#00f0ff');
            if (m.hp <= 0) {
              m.alive = false;
              this.player.score += 300;
              this.player.ryo += 35;
              this.notifyStats();
            }
          }
        });

        // Projectile vs Crates
        this.crates.forEach(c => {
          if (!c.broken && p.x > c.x && p.x < c.x + c.width && p.y > c.y && p.y < c.y + c.height) {
            c.broken = true;
            p.life = 0;
            sound.crate();
            this.createCrateSplinters(c.x + 18, c.y + 18);
          }
        });

        // Projectile vs Boss
        if (this.bossState.active && !this.bossState.defeated) {
          if (
            p.x > this.bossState.x &&
            p.x < this.bossState.x + this.bossState.width &&
            p.y > this.bossState.y &&
            p.y < this.bossState.y + this.bossState.height
          ) {
            p.life = 0;
            this.damageBoss(p.damage);
            this.createImpactSparks(p.x, p.y, '#00f0ff');
          }
        }
      } else {
        // Projectile vs Player
        if (
          p.x > this.player.x &&
          p.x < this.player.x + this.player.width &&
          p.y > this.player.y &&
          p.y < this.player.y + this.player.height
        ) {
          p.life = 0;
          this.damagePlayer(p.damage);
        }
      }

      if (p.life <= 0) {
        this.projectiles.splice(i, 1);
      }
    }

    // 11. Particles Update
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      if (pt.rotation !== undefined && pt.vRot !== undefined) {
        pt.rotation += pt.vRot;
      }
      if (pt.type === 'petal') {
        // Loop sakura petals
        if (pt.x > this.level.stageWidth) pt.x = 0;
        if (pt.y > this.viewHeight) pt.y = 0;
      } else {
        pt.alpha -= pt.decay;
        if (pt.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    // Invincible Timer countdown
    if (this.player.invincibleTimer > 0) this.player.invincibleTimer--;
    if (this.bossState.invincibleTimer > 0) this.bossState.invincibleTimer--;
    if (this.bossState.quoteTimer > 0) this.bossState.quoteTimer--;
  }

  // --- BOSS LOGIC ---
  private updateBoss() {
    const b = this.bossState;
    b.facing = this.player.x > b.x ? 1 : -1;

    // Movement toward player in arena
    const arenaMinX = this.level.stageWidth - 1050;
    const arenaMaxX = this.level.stageWidth - 80;

    b.actionTimer--;
    if (b.actionTimer <= 0) {
      // Choose next boss move
      b.actionTimer = this.level.boss.attackCooldown;
      const dist = Math.abs(this.player.x - b.x);

      if (dist < 160) {
        // Close range physical attack / charge
        b.state = 'charge';
        b.vx = b.facing * 5.5;
        b.vy = -4;
        sound.bossHit();
      } else {
        // Signature Jutsu Cast!
        b.state = 'jutsu';
        this.castBossJutsu();
      }
    }

    // Boss physics
    b.x += b.vx;
    b.y += b.vy;
    b.vy += 0.45;

    // Arena bounds
    if (b.x < arenaMinX) b.x = arenaMinX;
    if (b.x > arenaMaxX - b.width) b.x = arenaMaxX - b.width;

    // Ground platform collision
    for (const plat of this.level.platforms) {
      if (b.x + b.width > plat.x && b.x < plat.x + plat.width) {
        if (b.y + b.height >= plat.y && b.y < plat.y + 20) {
          b.y = plat.y - b.height;
          b.vy = 0;
          b.vx *= 0.8;
          break;
        }
      }
    }

    // Boss Stomp Check: Player can stomp on boss head if falling!
    const playerBottom = this.player.y + this.player.height;
    if (
      this.player.x + this.player.width > b.x &&
      this.player.x < b.x + b.width &&
      playerBottom > b.y &&
      this.player.y < b.y + 20
    ) {
      if (this.player.vy > 0 && b.invincibleTimer <= 0) {
        this.damageBoss(25 * this.externalBuff.atkMultiplier);
        this.player.vy = -9.5; // Stomp bounce
        sound.stomp();
      } else if (this.player.invincibleTimer <= 0) {
        this.damagePlayer(1);
      }
    }
  }

  private castBossJutsu() {
    const b = this.bossState;
    const mechanic = this.level.boss.specialMechanic;

    // Visual warning exclamation
    this.createFloatingText(b.x + 10, b.y - 30, `JUTSU: ${this.level.boss.signatureJutsu}`, this.level.boss.color);

    if (mechanic === 'sharingan') {
      // Kakashi Chidori Dash
      b.vx = b.facing * 9.5;
      b.vy = -3;
      sound.shunshin();
    } else if (mechanic === 'hidden_mist') {
      // Zabuza Water Dragon
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          this.projectiles.push({
            x: b.x + (b.facing === 1 ? b.width + 10 : -20),
            y: b.y + 10 + i * 15,
            vx: b.facing * 6.5,
            vy: 0,
            radius: 14,
            damage: 1,
            fromPlayer: false,
            type: 'water_shark',
            life: 90,
            color: '#06b6d4',
            rotation: 0
          });
        }, i * 120);
      }
    } else if (mechanic === 'snakes') {
      // Orochimaru Striking Shadow Snakes
      b.vx = b.facing * 7;
      for (let i = -1; i <= 1; i++) {
        this.projectiles.push({
          x: b.x,
          y: b.y + 20,
          vx: b.facing * 6,
          vy: i * 2,
          radius: 10,
          damage: 1,
          fromPlayer: false,
          type: 'shuriken',
          life: 80,
          color: '#a855f7',
          rotation: 0
        });
      }
    } else if (mechanic === 'sand_shield') {
      // Gaara Sand Barrage
      for (let i = 0; i < 4; i++) {
        this.projectiles.push({
          x: b.x,
          y: b.y + 15,
          vx: b.facing * (5 + i * 1.2),
          vy: (Math.random() - 0.5) * 4,
          radius: 8,
          damage: 1,
          fromPlayer: false,
          type: 'shuriken',
          life: 85,
          color: '#eab308',
          rotation: 0
        });
      }
    } else if (mechanic === 'amaterasu') {
      // Itachi Amaterasu black flames
      for (let i = 0; i < 3; i++) {
        this.projectiles.push({
          x: this.player.x + (i - 1) * 35,
          y: 350,
          vx: 0,
          vy: 6,
          radius: 12,
          damage: 1,
          fromPlayer: false,
          type: 'amaterasu',
          life: 90,
          color: '#000000',
          rotation: 0
        });
      }
    } else if (mechanic === 'shinra_tensei') {
      // Pain Almighty Push: Shinra Tensei
      sound.kyuubiRoar();
      const pDist = this.player.x - b.x;
      const pushDir = pDist >= 0 ? 1 : -1;
      this.player.vx = pushDir * 16;
      this.player.vy = -7;
      this.damagePlayer(1);
      // Shockwave ring
      for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        this.particles.push({
          x: b.x + 20,
          y: b.y + 25,
          vx: Math.cos(angle) * 9,
          vy: Math.sin(angle) * 9,
          size: 6,
          color: '#ef4444',
          alpha: 1,
          decay: 0.03,
          type: 'spark'
        });
      }
    } else {
      // General projectile assault (Kisame, Deidara, Sasuke, Kabuto)
      for (let i = 0; i < 3; i++) {
        this.projectiles.push({
          x: b.x,
          y: b.y + 15,
          vx: b.facing * 6,
          vy: (i - 1) * 2.5,
          radius: 10,
          damage: 1,
          fromPlayer: false,
          type: 'kunai',
          life: 80,
          color: this.level.boss.color || '#f97316',
          rotation: 0
        });
      }
    }
  }

  public damageBoss(amount: number) {
    if (this.bossState.defeated || this.bossState.invincibleTimer > 0) return;

    this.bossState.hp -= amount;
    this.bossState.invincibleTimer = 18;
    sound.bossHit();

    if (this.bossState.hp <= 0) {
      this.bossState.hp = 0;
      this.bossState.defeated = true;
      sound.bossDeath();
      this.player.score += 2000;
      this.player.ryo += 300;

      // Victory fanfare & level clear
      setTimeout(() => {
        sound.levelClear();
        this.callbacks.onLevelComplete(this.level.levelNum, this.player.score, this.player.scrollsFound);
      }, 1200);
    }
  }

  public damagePlayer(amount: number) {
    if (this.player.invincibleTimer > 0 || this.player.isDashing) return;

    this.player.hp -= amount;
    this.player.invincibleTimer = 55; // i-frames
    this.player.vy = -6;
    this.player.vx = -this.player.facing * 5; // knockback
    sound.hit();
    this.notifyStats();

    if (this.player.hp <= 0) {
      this.player.hp = 0;
      sound.gameOver();
      this.callbacks.onGameOver();
    }
  }

  // Visual text & spark emitters
  private createFloatingText(x: number, y: number, text: string, color: string) {
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: -1.2,
      size: 14,
      color,
      alpha: 1,
      decay: 0.02,
      type: 'smoke',
      rotation: 0
    });
    // Record text on canvas via temporary effect
    this.ctx.save();
    this.ctx.font = '12px "Press Start 2P"';
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x - this.cameraX, y);
    this.ctx.restore();
  }

  private createImpactSparks(x: number, y: number, color: string) {
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 7,
        vy: (Math.random() - 0.5) * 7,
        size: 3 + Math.random() * 3,
        color,
        alpha: 1,
        decay: 0.05,
        type: 'spark'
      });
    }
  }

  private createCrateSplinters(x: number, y: number) {
    for (let i = 0; i < 16; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 6,
        size: 4 + Math.random() * 4,
        color: '#b45309',
        alpha: 1,
        decay: 0.04,
        type: 'spark'
      });
    }
  }

  // --- RENDER ---
  public render() {
    const ctx = this.ctx;
    const w = this.viewWidth;
    const h = this.viewHeight;
    const camX = this.cameraX;

    ctx.clearRect(0, 0, w, h);

    // 1. LAYER 1: Deep Sky & Sunset Horizon
    this.renderSkyLayer(ctx, w, h, camX);

    // 2. LAYER 2: Mount Hokage & Distant Mountain Ridges
    this.renderMountHokageLayer(ctx, w, h, camX);

    // 3. LAYER 3: Village Rooftops & Lanterns
    this.renderVillageRoofsLayer(ctx, w, h, camX);

    // 4. LAYER 4: Active Stage (Platforms, Crates, Hazards)
    this.renderStagePlatforms(ctx, camX);

    // 5. Collectibles & Crates
    this.renderCollectibles(ctx, camX);

    // 6. Minions
    this.renderMinions(ctx, camX);

    // 7. Boss
    this.renderBoss(ctx, camX);

    // 8. Player (Naruto)
    this.renderPlayer(ctx, camX);

    // 9. Projectiles & Particles
    this.renderProjectilesAndParticles(ctx, camX);

    // 10. HUD & Boss Bar
    this.renderHUD(ctx, w, h);
  }

  private renderSkyLayer(ctx: CanvasRenderingContext2D, w: number, h: number, _camX: number) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    if (this.level.boss.arenaTheme === 'desert') {
      grad.addColorStop(0, '#1c1917');
      grad.addColorStop(0.6, '#78350f');
      grad.addColorStop(1, '#d97706');
    } else if (this.level.boss.arenaTheme === 'valley') {
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.6, '#312e81');
      grad.addColorStop(1, '#4338ca');
    } else {
      // Twilight Konoha Sky
      grad.addColorStop(0, '#090e17');
      grad.addColorStop(0.5, '#1e1b4b');
      grad.addColorStop(0.85, '#831843');
      grad.addColorStop(1, '#ff6a00');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Glowing Moon
    ctx.save();
    ctx.beginPath();
    ctx.arc(w - 140, 110, 36, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 25;
    ctx.fill();
    ctx.restore();
  }

  private renderMountHokageLayer(ctx: CanvasRenderingContext2D, w: number, h: number, camX: number) {
    ctx.save();
    const parallax = camX * 0.15;
    ctx.fillStyle = '#111827';

    // Mount Hokage Silhouette with carved rock cliffs
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 100; x += 80) {
      const worldX = x + parallax;
      const peak = 240 + Math.sin(worldX * 0.003) * 60 + Math.cos(worldX * 0.008) * 30;
      ctx.lineTo(x, peak);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Carved Face profile details on mountain
    ctx.fillStyle = '#1f2937';
    for (let i = 0; i < 4; i++) {
      const faceX = 180 + i * 260 - (parallax % (w + 200));
      if (faceX > -100 && faceX < w + 100) {
        // Hokage silhouette profile head
        ctx.fillRect(faceX, 260, 35, 45);
        ctx.fillRect(faceX - 8, 275, 12, 10); // nose
        ctx.fillRect(faceX + 6, 252, 22, 12); // headgear
      }
    }
    ctx.restore();
  }

  private renderVillageRoofsLayer(ctx: CanvasRenderingContext2D, w: number, h: number, camX: number) {
    ctx.save();
    const parallax = camX * 0.4;
    ctx.fillStyle = '#1e293b';

    // Pagoda roof silhouettes & red glowing lanterns
    for (let i = 0; i < 15; i++) {
      const roofX = i * 220 - (parallax % 3300);
      if (roofX > -250 && roofX < w + 250) {
        // Japanese sloping tiled roof
        ctx.beginPath();
        ctx.moveTo(roofX, 420);
        ctx.lineTo(roofX + 70, 370);
        ctx.lineTo(roofX + 140, 420);
        ctx.closePath();
        ctx.fill();

        // Pagoda Base
        ctx.fillRect(roofX + 25, 420, 90, 80);

        // Hanging Paper Lantern
        ctx.save();
        ctx.beginPath();
        ctx.arc(roofX + 70, 435, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();
  }

  private renderStagePlatforms(ctx: CanvasRenderingContext2D, camX: number) {
    this.level.platforms.forEach(p => {
      const screenX = p.x - camX;
      if (screenX + p.width > 0 && screenX < this.viewWidth) {
        // Wooden / Stone Platform
        ctx.save();
        ctx.fillStyle = p.oneWay ? '#78350f' : '#334155';
        ctx.fillRect(screenX, p.y, p.width, p.height);

        // Platform top border (highlight grass / wood trim)
        ctx.fillStyle = p.oneWay ? '#b45309' : '#475569';
        ctx.fillRect(screenX, p.y, p.width, 5);

        // Wood grain / stone texture lines
        ctx.strokeStyle = p.oneWay ? '#451a03' : '#1e293b';
        ctx.lineWidth = 1;
        for (let lx = 20; lx < p.width; lx += 30) {
          ctx.beginPath();
          ctx.moveTo(screenX + lx, p.y);
          ctx.lineTo(screenX + lx, p.y + p.height);
          ctx.stroke();
        }
        ctx.restore();
      }
    });

    // Hazards (Spikes / Pits)
    this.level.hazards.forEach(h => {
      const screenX = h.x - camX;
      if (screenX + h.width > 0 && screenX < this.viewWidth) {
        ctx.save();
        ctx.fillStyle = '#ef4444';
        for (let sx = 0; sx < h.width; sx += 14) {
          ctx.beginPath();
          ctx.moveTo(screenX + sx, h.y);
          ctx.lineTo(screenX + sx + 7, h.y - 14);
          ctx.lineTo(screenX + sx + 14, h.y);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
    });
  }

  private renderCollectibles(ctx: CanvasRenderingContext2D, camX: number) {
    // Crates
    this.crates.forEach(c => {
      if (!c.broken) {
        const sx = c.x - camX;
        if (sx > -40 && sx < this.viewWidth + 40) {
          ctx.save();
          ctx.fillStyle = '#b45309';
          ctx.fillRect(sx, c.y, c.width, c.height);
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx, c.y, c.width, c.height);
          // Crate cross brace
          ctx.beginPath();
          ctx.moveTo(sx, c.y);
          ctx.lineTo(sx + c.width, c.y + c.height);
          ctx.moveTo(sx + c.width, c.y);
          ctx.lineTo(sx, c.y + c.height);
          ctx.stroke();
          // Chakra emblem on crate
          ctx.fillStyle = '#fef08a';
          ctx.font = '10px "Press Start 2P"';
          ctx.fillText('忍', sx + 12, c.y + 24);
          ctx.restore();
        }
      }
    });

    // Collectibles (Ramen & Scrolls)
    this.collectibles.forEach(c => {
      if (!c.collected) {
        const sx = c.x - camX;
        const sy = c.y + Math.sin(c.bobOffset) * 5;
        if (sx > -40 && sx < this.viewWidth + 40) {
          ctx.save();
          if (c.type === 'ramen') {
            // Teuchi's Ramen Bowl
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.arc(sx + 14, sy + 14, 12, 0, Math.PI);
            ctx.fill();
            // Noodles top
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(sx + 4, sy + 10, 20, 5);
            // Chopsticks
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(sx + 6, sy + 6);
            ctx.lineTo(sx + 24, sy + 12);
            ctx.stroke();
          } else if (c.type === 'scroll') {
            // Secret Ninja Scroll (Gold with glow)
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(sx + 4, sy + 6, 20, 14);
            ctx.fillStyle = '#92400e';
            ctx.fillRect(sx + 2, sy + 4, 4, 18);
            ctx.fillRect(sx + 22, sy + 4, 4, 18);
            // Red Kanji ribbon
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(sx + 12, sy + 6, 4, 14);
          }
          ctx.restore();
        }
      }
    });
  }

  private renderMinions(ctx: CanvasRenderingContext2D, camX: number) {
    this.minions.forEach(m => {
      if (m.alive) {
        const sx = m.x - camX;
        if (sx > -50 && sx < this.viewWidth + 50) {
          ctx.save();
          // Rogue Sound/Mist Ninja Sprite
          ctx.fillStyle = m.type === 'mist_rogue' ? '#0891b2' : '#7c3aed';
          ctx.fillRect(sx + 4, m.y + 12, 24, 26); // body
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(sx + 6, m.y + 36, 8, 10); // left leg
          ctx.fillRect(sx + 18, m.y + 36, 8, 10); // right leg

          // Masked Head
          ctx.fillStyle = '#fbcfe8';
          ctx.fillRect(sx + 8, m.y, 16, 14);
          ctx.fillStyle = '#0f172a'; // headband/mask
          ctx.fillRect(sx + 6, m.y + 4, 20, 5);
          ctx.restore();
        }
      }
    });
  }

  private renderBoss(ctx: CanvasRenderingContext2D, camX: number) {
    const b = this.bossState;
    if (!b.active && !b.defeated) return;

    const sx = b.x - camX;
    if (sx < -80 || sx > this.viewWidth + 80) return;

    ctx.save();

    // Invulnerability Blink
    if (b.invincibleTimer > 0 && Math.floor(b.invincibleTimer / 4) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Boss Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(sx + b.width / 2, b.y + b.height + 2, 20, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Boss Body & Robes (Akatsuki black cloak with red clouds or character clothes)
    ctx.fillStyle = this.level.boss.color || '#ef4444';
    ctx.fillRect(sx + 4, b.y + 16, b.width - 8, b.height - 24);

    // Character Head & Hair
    ctx.fillStyle = '#fde047'; // Hair
    ctx.fillRect(sx + 6, b.y, b.width - 12, 14);
    ctx.fillStyle = '#fed7aa'; // Face
    ctx.fillRect(sx + 10, b.y + 8, b.width - 20, 10);

    // Glowing Eye (Sharingan red / Rinnegan purple)
    ctx.fillStyle = this.level.boss.specialMechanic === 'shinra_tensei' ? '#c084fc' : '#ef4444';
    const eyeX = b.facing === 1 ? sx + b.width - 16 : sx + 12;
    ctx.beginPath();
    ctx.arc(eyeX, b.y + 12, 3, 0, Math.PI * 2);
    ctx.fill();

    // Boss Quote Speech Bubble if active
    if (b.quoteTimer > 0 && !b.defeated) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#ff6a00';
      ctx.lineWidth = 1;
      const bw = 240;
      const bx = Math.max(10, Math.min(this.viewWidth - bw - 10, sx - 80));
      ctx.fillRect(bx, b.y - 65, bw, 45);
      ctx.strokeRect(bx, b.y - 65, bw, 45);
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px "Press Start 2P"';
      ctx.fillText(this.level.boss.name, bx + 8, b.y - 50);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(this.level.boss.quote.substring(0, 30) + '...', bx + 8, b.y - 32);
    }

    ctx.restore();
  }

  private renderPlayer(ctx: CanvasRenderingContext2D, camX: number) {
    const p = this.player;
    const sx = p.x - camX;

    ctx.save();

    // Invulnerability Blink
    if (p.invincibleTimer > 0 && Math.floor(p.invincibleTimer / 4) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Shunshin Trail Glow
    if (p.isDashing) {
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 18;
    }

    // Player Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(sx + p.width / 2, p.y + p.height, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Naruto Jumpsuit (Iconic Konoha Orange & Deep Navy)
    ctx.fillStyle = '#ff6a00'; // Orange jacket body
    ctx.fillRect(sx + 4, p.y + 16, 24, 20);

    ctx.fillStyle = '#1e3a8a'; // Blue shoulder patches
    ctx.fillRect(sx + 2, p.y + 16, 6, 8);
    ctx.fillRect(sx + 24, p.y + 16, 6, 8);

    // Orange Pants
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(sx + 5, p.y + 34, 10, 14);
    ctx.fillRect(sx + 17, p.y + 34, 10, 14);

    // Blue Ninja Sandals
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(sx + 4, p.y + 45, 11, 5);
    ctx.fillRect(sx + 17, p.y + 45, 11, 5);

    // Spiky Blond Hair
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(sx + 4, p.y + 8);
    ctx.lineTo(sx + 8, p.y - 2);
    ctx.lineTo(sx + 16, p.y + 2);
    ctx.lineTo(sx + 24, p.y - 4);
    ctx.lineTo(sx + 28, p.y + 8);
    ctx.closePath();
    ctx.fill();

    // Face & Whiskers
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(sx + 6, p.y + 6, 20, 11);

    // Konoha Blue Headband & Metal Plate
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(sx + 4, p.y + 5, 24, 5);
    ctx.fillStyle = '#e2e8f0'; // Metal plate
    ctx.fillRect(sx + 10, p.y + 5, 12, 4);

    // Whiskers
    ctx.fillStyle = '#9a3412';
    const faceFacingX = p.facing === 1 ? sx + 18 : sx + 8;
    ctx.fillRect(faceFacingX, p.y + 11, 4, 1);
    ctx.fillRect(faceFacingX, p.y + 13, 4, 1);

    ctx.restore();
  }

  private renderProjectilesAndParticles(ctx: CanvasRenderingContext2D, camX: number) {
    // Projectiles
    this.projectiles.forEach(p => {
      const sx = p.x - camX;
      if (sx > -30 && sx < this.viewWidth + 30) {
        ctx.save();
        if (p.type === 'rasengan') {
          // Swirling Rasengan vortex with cyan chakra glow
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 16;
          ctx.fillStyle = '#00f0ff';
          ctx.beginPath();
          ctx.arc(sx, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          // Internal spiral swirl
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(sx, p.y, p.radius * 0.6, p.rotation || 0, (p.rotation || 0) + Math.PI * 1.5);
          ctx.stroke();
        } else {
          // Shuriken / Kunai
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(sx, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    // Particles
    this.particles.forEach(pt => {
      const sx = pt.x - camX;
      if (sx > -20 && sx < this.viewWidth + 20) {
        ctx.save();
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;

        if (pt.type === 'petal') {
          // Fluttering pink cherry blossom petal
          ctx.translate(sx, pt.y);
          ctx.rotate(pt.rotation || 0);
          ctx.beginPath();
          ctx.ellipse(0, 0, pt.size, pt.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (pt.type === 'smoke') {
          ctx.beginPath();
          ctx.arc(sx, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(sx, pt.y, pt.size, pt.size);
        }
        ctx.restore();
      }
    });
  }

  private renderHUD(ctx: CanvasRenderingContext2D, w: number, _h: number) {
    ctx.save();

    // 1. Health Hearts (3 Shinobi Hearts)
    for (let i = 0; i < this.player.maxHp; i++) {
      const heartX = 24 + i * 28;
      const heartY = 22;
      ctx.fillStyle = i < this.player.hp ? '#ef4444' : '#334155';
      ctx.shadowColor = i < this.player.hp ? '#ef4444' : 'transparent';
      ctx.shadowBlur = 8;
      // Heart Icon shape
      ctx.beginPath();
      ctx.arc(heartX, heartY, 6, Math.PI, 0);
      ctx.arc(heartX + 10, heartY, 6, Math.PI, 0);
      ctx.lineTo(heartX + 5, heartY + 12);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Chakra Meter (0 to 100)
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(24, 42, 140, 10);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1;
    ctx.strokeRect(24, 42, 140, 10);

    const chakraWidth = (this.player.chakra / this.player.maxChakra) * 138;
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.fillRect(25, 43, chakraWidth, 8);
    ctx.shadowBlur = 0;

    // 3. Score & Ryo
    ctx.fillStyle = '#ffffff';
    ctx.font = '9px "Press Start 2P"';
    ctx.fillText(`SCORE: ${this.player.score}`, 180, 30);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`RYO: ${this.player.ryo}`, 180, 48);

    // 4. Secret Scrolls Count
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`SCROLLS: ${this.player.scrollsFound}/3`, 320, 30);

    // 5. Boss Health Bar (Top Center if Boss Active)
    if (this.bossState.active && !this.bossState.defeated) {
      const barWidth = 360;
      const barX = (w - barWidth) / 2;
      const barY = 20;

      // Boss Name & Title
      ctx.fillStyle = '#ef4444';
      ctx.font = '10px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText(`${this.level.boss.name.toUpperCase()} - ${this.level.boss.title}`, w / 2, barY - 6);

      // Background bar
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(barX, barY, barWidth, 14);
      ctx.strokeStyle = this.level.boss.color || '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(barX, barY, barWidth, 14);

      // Fill bar
      const hpPct = Math.max(0, this.bossState.hp / this.bossState.maxHp);
      ctx.fillStyle = this.level.boss.color || '#ef4444';
      ctx.fillRect(barX + 2, barY + 2, (barWidth - 4) * hpPct, 10);

      ctx.textAlign = 'left';
    }

    ctx.restore();
  }
}
